// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {OrderLib} from "./libraries/OrderLib.sol";
import {OrderSig} from "./libraries/OrderSig.sol";
import {AddressLib} from "./libraries/AddressLib.sol";
import {NonblockingLzApp} from "./lzApp/NonblockingLzApp.sol";
import {IFillerOracle} from "./interfaces/IFillerOracle.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Settlement is Initializable, NonblockingLzApp {
    using AddressLib for bytes32;
    using SafeERC20 for IERC20;

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error NotTooRelevantRightNow();
    error InvalidOrderSignature(bytes32 hash);
    error CallerNotMakerOrTaker();
    error AlreadyFilled(bytes32 hash);
    error NoPartialFills(bytes32 hash);
    error BadOriginChainId(uint256 expectedChainId, uint256 providedChainId);
    error BadDestinationChainId(
        uint256 expectedChainId,
        uint256 providedChainId
    );

    /*//////////////////////////////////////////////////////////////
                                TYPES
    //////////////////////////////////////////////////////////////*/

    enum OrderStatus {
        FILLED,
        CANCELLED,
        EXPIRED,
        PENDING,
        RETRY
    }

    struct OrderData {
        OrderStatus status;
        bytes32 maker;
        bytes32 makerToken;
        uint256 makerAmount;
        uint256 takerAmount;
    }

    /*//////////////////////////////////////////////////////////////
                                IMMUTABLES
    //////////////////////////////////////////////////////////////*/

    // this would be the chainId, however, for testinng, with the
    // mock endpoint, we need to manually configure it
    // uint256 public immutable THIS_CHAIN_ID;

    /*//////////////////////////////////////////////////////////////
                                STATE
    //////////////////////////////////////////////////////////////*/

    address payable public REFUND_ADDRESS;
    uint256 public THIS_CHAIN_ID;
    uint256 public ld2sdRate;
    mapping(uint32 => mapping(bytes32 => OrderData)) statuses;

    /*//////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(address endpoint) NonblockingLzApp(endpoint) {
        uint256 cId;
        assembly {
            cId := chainid()
        }
        THIS_CHAIN_ID = cId;
    }

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
        // validate chain - origin id
        if (THIS_CHAIN_ID != order.originChainId)
            revert BadOriginChainId(THIS_CHAIN_ID, order.originChainId);

        // compute the order hash
        bytes32 orderHash = OrderLib.getHash(order);
        // verify order sig
        verifySignature(
            orderHash,
            order.swapper, //
            signature
        );

        // report the status to the oracle
        _reportSettlementAttempt(order, orderHash);
        // transfer maker amount to oracle
        IERC20(order.originToken.toEvmAddress()).safeTransferFrom(
            order.swapper.toEvmAddress(),
            address(this),
            order.originAmount
        );
    }

    function getOrderTypeHash() external view returns (bytes32) {
        return OrderLib.getOrderTypeHash();
    }

    function getOrderHash(
        OrderLib.CrossChainOrder calldata order
    ) external view returns (bytes32) {
        return OrderLib.getHash(order);
    }

    function verifySignature(
        bytes32 orderHash,
        bytes32 swapper,
        bytes calldata signature
    ) public view {
        if (
            swapper.toEvmAddress() !=
            OrderSig.getSignerOfHash(orderHash, signature)
        ) revert InvalidOrderSignature(orderHash);
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
        // validate chain - destination id
        if (THIS_CHAIN_ID != order.destinationChainId)
            revert BadDestinationChainId(
                THIS_CHAIN_ID,
                order.destinationChainId
            );
        // the destination chainId for layer 0
        // is the origin chainId of the order
        uint16 _dstChainId = uint16(order.originChainId);
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

    function lzReceive(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        uint64 _nonce,
        bytes calldata _payload
    ) public virtual override {
        // the original `lzReceive` does the access check already
        super.lzReceive(_srcChainId, _srcAddress, _nonce, _payload);
        // start business logic here
        (bytes32 orderHash, bytes32 receiver, OrderStatus fillStatus) = abi
            .decode(_payload, (bytes32, bytes32, OrderStatus));

        OrderData memory orderData = statuses[_srcChainId][orderHash];
        if (fillStatus == OrderStatus.FILLED) {
            // transfer maker amount to filler-defined receiver
            IERC20(orderData.makerToken.toEvmAddress()).safeTransfer(
                receiver.toEvmAddress(),
                orderData.makerAmount
            );
        }
        // user cancelled on destination chain
        else if (fillStatus == OrderStatus.CANCELLED) {
            // transfer maker amount back to swapper
            IERC20(orderData.makerToken.toEvmAddress()).safeTransfer(
                orderData.maker.toEvmAddress(),
                orderData.makerAmount
            );
        }
    }

    // we log the order as pending
    function _reportSettlementAttempt(
        OrderLib.CrossChainOrder calldata order,
        bytes32 orderHash
    ) internal {
        OrderData memory orderData = OrderData(
            OrderStatus.PENDING,
            order.swapper,
            order.originToken,
            order.originAmount,
            order.destinationAmount
        );
        statuses[order.destinationChainId][orderHash] = orderData;
    }

    //@notice override this function
    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64 _nonce,
        bytes memory _payload
    ) internal virtual override {}

    function _encodeSendPayload(
        bytes32 _toAddress,
        bytes32 _orderHash
    ) internal view virtual returns (bytes memory) {
        return abi.encodePacked(_orderHash, _toAddress, uint256(0));
    }

    function estimateSendFee(
        uint16 _dstChainId,
        bytes32 _toAddress,
        bytes32 _orderHash,
        bool _useZro,
        bytes memory _adapterParams
    ) external view virtual returns (uint nativeFee, uint zroFee) {
        // mock the payload for sendFrom()
        bytes memory payload = _encodeSendPayload(_orderHash, _toAddress);
        return
            lzEndpoint.estimateFees(
                _dstChainId,
                address(this),
                payload,
                _useZro,
                _adapterParams
            );
    }
}
