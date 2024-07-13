// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {OrderLib} from "./libraries/OrderLib.sol";
import {OrderSig} from "./libraries/OrderSig.sol";
import {AddressLib} from "./libraries/AddressLib.sol";
import {OApp, MessagingFee, Origin} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/OApp.sol";
import {MessagingParams, MessagingFee, MessagingReceipt} from "@layerzerolabs/lz-evm-protocol-v2/contracts/interfaces/ILayerZeroEndpointV2.sol";
import {IFillerOracle} from "./interfaces/IFillerOracle.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Settlement is Initializable, OApp {
    using AddressLib for bytes32;
    using SafeERC20 for IERC20;

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    event FillingInititated(bytes32 hash);
    event FillingCompleted(bytes32 hash);
    event SolverPaid(bytes32 hash);
    event OrderCancelled(bytes32 hash);

    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error NotTooRelevantRightNow();
    error InvalidOrderSignature(bytes32 hash);
    error CallerNotMakerOrTaker();
    error AlreadyFilled(bytes32 hash);
    error NoPartialFills(bytes32 hash);
    error NotFillable(bytes32 hash);
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
    // destinationChainId -> orderHash -> data
    mapping(uint32 => mapping(bytes32 => OrderData)) statuses;
    // destinationChainId -> orderHash -> notFillable
    mapping(uint32 => mapping(bytes32 => bool)) notFillable;
    // only to make our live easier
    mapping(uint32 => uint32) chainIdToEid;
    mapping(uint32 => uint32) eidToChainId;

    /*//////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/

    constructor(
        address endpoint,
        address delegate
    ) OApp(endpoint, delegate) Ownable(msg.sender) {
        uint256 cId;
        assembly {
            cId := chainid()
        }
        THIS_CHAIN_ID = cId;
        chainIdToEid[137] = 30109; // polygon
        chainIdToEid[5000] = 30181; // mantle
        chainIdToEid[42161] = 30110; // arb
        chainIdToEid[0] = 30168; // solana

        eidToChainId[30109] = 137; // polygon
        eidToChainId[30181] = 5000; // mantle
        eidToChainId[30110] = 42161; // arb
        eidToChainId[30168] = 0; // solana
        REFUND_ADDRESS = payable(msg.sender);
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

        emit FillingInititated(orderHash);
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
        bytes calldata endpointOptions
    ) external payable {
        // validate chain - destination id
        if (THIS_CHAIN_ID != order.destinationChainId)
            revert BadDestinationChainId(
                THIS_CHAIN_ID,
                order.destinationChainId
            );
        // the destination chainId for layer 0
        // is the origin chainId of the order
        uint16 _layerZeroDstChainId = uint16(order.originChainId);
        bytes32 orderHash = OrderLib.getHash(order);

        // revert if the order is filled
        // then set it as filled
        if (notFillable[order.destinationChainId][orderHash])
            revert NotFillable(orderHash);
        else notFillable[order.destinationChainId][orderHash] = true;

        // Fill the order by transferring funds from the caller to the
        // receiver
        IERC20(order.destinationToken.toEvmAddress()).safeTransferFrom(
            msg.sender,
            order.destinationReceiver.toEvmAddress(),
            order.destinationAmount
        );

        // we set the status to FILLED per default
        // thereretically, many variations are possible here, e.g.
        // partial fills
        bytes memory payload = abi.encodePacked(
            orderHash,
            originAmountReceiver,
            uint256(0)
        );
        // transmit the message
        // endpoint.send{value: msg.value}(
        //     _layerZeroDstChainId,
        //     trustedRemote,
        //     payload,
        //     REFUND_ADDRESS,
        //     msg.sender,
        //     adapterParams
        // );
        // sending from destinationChainId -> originChainId
        uint32 eId = chainIdToEid[order.originChainId];
        endpoint.send{value: msg.value}(
            MessagingParams(
                eId,
                _getPeerOrRevert(eId),
                payload,
                endpointOptions,
                false
            ),
            REFUND_ADDRESS
        );

        emit FillingCompleted(orderHash);
    }

    function cancelOrder(
        OrderLib.CrossChainOrder calldata order,
        bytes calldata endpointOptions
    ) external payable {
        // validate chain - destination id
        if (THIS_CHAIN_ID != order.destinationChainId)
            revert BadDestinationChainId(
                THIS_CHAIN_ID,
                order.destinationChainId
            );

        require(
            order.destinationReceiver.toEvmAddress() == msg.sender,
            "Only destiantion receiver can cancel"
        );

        bytes32 orderHash = OrderLib.getHash(order);

        // revert if the order is filled
        // then set it as filled
        if (notFillable[order.destinationChainId][orderHash])
            revert NotFillable(orderHash);
        else notFillable[order.destinationChainId][orderHash] = true;

        // we set the status to FILLED per default
        // thereretically, many variations are possible here, e.g.
        // partial fills
        bytes memory payload = abi.encodePacked(
            orderHash,
            bytes32(0),
            uint256(1) // 1 is cancelled
        );

        uint32 eId = chainIdToEid[order.originChainId];
        // struct MessagingParams {
        //     uint32 dstEid;
        //     bytes32 receiver;
        //     bytes message;
        //     bytes options;
        //     bool payInLzToken;
        // }

        // transmit the message
        endpoint.send{value: msg.value}(
            MessagingParams(
                eId,
                _getPeerOrRevert(eId),
                payload,
                endpointOptions,
                false
            ),
            REFUND_ADDRESS
        );

        emit OrderCancelled(orderHash);
    }

    // struct Origin {
    //     uint32 srcEid;
    //     bytes32 sender;
    //     uint64 nonce;
    // }
    function _lzReceive(
        Origin calldata _origin,
        bytes32 _guid,
        bytes calldata _message,
        address _executor,
        bytes calldata _extraData
    ) internal virtual override {
        // start business logic here
        (bytes32 orderHash, bytes32 receiver, OrderStatus fillStatus) = abi
            .decode(_message, (bytes32, bytes32, OrderStatus));

        OrderData memory orderData = statuses[eidToChainId[_origin.srcEid]][
            orderHash
        ];
        if (fillStatus == OrderStatus.FILLED) {
            // transfer maker amount to filler-defined receiver
            IERC20(orderData.makerToken.toEvmAddress()).safeTransfer(
                receiver.toEvmAddress(),
                orderData.makerAmount
            );
            emit SolverPaid(orderHash);
        }
        // user cancelled on destination chain
        else if (fillStatus == OrderStatus.CANCELLED) {
            // transfer maker amount back to swapper
            IERC20(orderData.makerToken.toEvmAddress()).safeTransfer(
                orderData.maker.toEvmAddress(),
                orderData.makerAmount
            );
            emit OrderCancelled(orderHash);
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

    function _encodeSendPayload(
        bytes32 _toAddress,
        bytes32 _orderHash
    ) internal view virtual returns (bytes memory) {
        return abi.encodePacked(_orderHash, _toAddress, uint256(0));
    }

    // Only for the hackathon in case some funds get stuck
    function emergencyWithdraw(address asset) external onlyOwner {
        if (asset == address(0)) {
            (bool success, ) = payable(msg.sender).call{
                value: address(this).balance
            }("");
            require(success, "native transfer failed");
        } else {
            IERC20(asset).safeTransfer(
                msg.sender,
                IERC20(asset).balanceOf(address(this)) //
            );
        }
    }

    /**
     * @dev Internal function to interact with the LayerZero EndpointV2.quote() for fee calculation.
     * @param _dstEid The destination endpoint ID.
     * @param _message The message payload.
     * @param _options Additional options for the message.
     * @param _payInLzToken Flag indicating whether to pay the fee in LZ tokens.
     * @return fee The calculated MessagingFee for the message.
     *      - nativeFee: The native fee for the message.
     *      - lzTokenFee: The LZ token fee for the message.
     */
    function quote(
        uint32 _dstEid,
        bytes memory _message,
        bytes memory _options,
        bool _payInLzToken
    ) external view returns (MessagingFee memory fee) {
        return
            endpoint.quote(
                MessagingParams(
                    _dstEid,
                    _getPeerOrRevert(_dstEid),
                    _message,
                    _options,
                    _payInLzToken
                ),
                address(this)
            );
    }
}
