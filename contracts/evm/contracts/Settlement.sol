// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {OrderLib} from "./libraries/OrderLib.sol";
import {OrderSig} from "./libraries/OrderSig.sol";
import {AddressLib} from "./libraries/AddressLib.sol";
import {NonblockingLzApp} from "./lzApp/NonblockingLzApp.sol";
import {IFillerOracle} from "./interfaces/IFillerOracle.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Settlement is Initializable, NonblockingLzApp {
    using AddressLib for bytes32;
    using SafeERC20 for IERC20;

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error NotTooRelevantRightNow();
    error InvalidOrderSignature(bytes32 hash);

    /*//////////////////////////////////////////////////////////////
                                STATE
    //////////////////////////////////////////////////////////////*/

    address public FILLER_ORACLE;

    address payable public REFUND_ADDRESS;

    constructor(address endpoint) NonblockingLzApp(endpoint) {}

    /// @notice Initiates the settlement of a cross-chain order
    /// @dev To be called by the filler
    /// @param order The CrossChainOrder definition
    /// @param signature The swapper's signature over the order
    /// @param fillerData Any filler-defined data required by the settler
    function initiate(
        OrderLib.CrossChainOrder calldata order,
        bytes calldata signature,
        bytes calldata fillerData
    ) external {
        // compute the order hash
        bytes32 orderHash = OrderLib.getHash(order);
        // verify order sig
        if (
            order.swapper.toEvmAddress() !=
            OrderSig.getSignerOfHash(orderHash, signature)
        ) revert InvalidOrderSignature(orderHash);

        address fillerOracle = FILLER_ORACLE;
        // report the status to the oracle
        IFillerOracle(fillerOracle).reportSettlementAttempt(order, orderHash);
        // transfer maker amount to oracle
        IERC20(order.originToken.toEvmAddress()).safeTransferFrom(
            order.swapper.toEvmAddress(),
            fillerOracle,
            order.originAmount
        );
    }

    function intitalize(
        address fillerOracle,
        address refundAddress
    ) public initializer {
        FILLER_ORACLE = fillerOracle;
        REFUND_ADDRESS = payable(refundAddress);
    }

    /// @notice Resolves a specific CrossChainOrder into a generic ResolvedCrossChainOrder
    /// @dev Intended to improve standardized integration of various order types and settlement contracts
    /// @param order The CrossChainOrder definition
    /// @param fillerData Any filler-defined data required by the settler
    function resolve(
        OrderLib.CrossChainOrder calldata order,
        bytes calldata fillerData
    ) external view returns (OrderLib.ResolvedCrossChainOrder memory) {
        revert NotTooRelevantRightNow();
    }

    function settle(
        bytes32 originAmountReceiver,
        OrderLib.CrossChainOrder calldata order,
        bytes calldata adapterParams
    ) external payable {
        uint16 _dstChainId = uint16(order.destinationChainId);
        bytes memory trustedRemote = trustedRemoteLookup[_dstChainId];
        require(
            trustedRemote.length != 0,
            "LzApp: destination chain is not a trusted source"
        );

        // Fill the order by transferring funds from the caller to the
        // receiver
        IERC20(order.destinationToken.toEvmAddress()).safeTransferFrom(
            msg.sender,
            order.destinationReceiver.toEvmAddress(),
            order.destinationAmount
        );

        bytes32 orderHash = OrderLib.getHash(order);

        // we set the status to FILLED per default
        // thereretically, many variations are possible here, e.g.
        // partial fills
        bytes memory payload = abi.encodePacked(
            orderHash,
            originAmountReceiver,
            uint256(0)
        );
        // transmit the message
        lzEndpoint.send{value: msg.value}(
            _dstChainId,
            trustedRemote,
            payload,
            REFUND_ADDRESS,
            msg.sender,
            adapterParams
        );
    }

    //@notice override this function
    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) internal virtual override {}
}
