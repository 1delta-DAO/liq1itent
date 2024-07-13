// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {OrderLib} from "./libraries/OrderLib.sol";
import {AddressLib} from "./libraries/AddressLib.sol";
import {NonblockingLzApp} from "./lzApp/NonblockingLzApp.sol";

contract FillerOracle is NonblockingLzApp {
    using SafeERC20 for IERC20;
    using AddressLib for bytes32;

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error CallerNotMakerOrTaker();
    error AlreadyFilled(bytes32 hash);
    error NoPartialFills(bytes32 hash);

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

    mapping(uint32 => mapping(bytes32 => OrderData)) statuses;

    address public immutable SETTLEMENT;

    modifier onlySettlement() {
        require(msg.sender == SETTLEMENT, "Unauthorized");
        _;
    }

    constructor(
        address settlement,
        address endpoint
    ) NonblockingLzApp(endpoint) {
        SETTLEMENT = settlement;
    }

    function lzReceive(
        uint16 _srcChainId,
        bytes calldata _srcAddress,
        uint64 _nonce,
        bytes calldata _payload
    ) public virtual override {
        super.lzReceive(_srcChainId, _srcAddress, _nonce, _payload);
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

    function reportSettlementAttempt(
        OrderLib.CrossChainOrder calldata order,
        bytes32 orderHash
    ) external onlySettlement {
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
}
