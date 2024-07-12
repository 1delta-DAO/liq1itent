// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

library OrderLib {
    bytes32 internal constant ORDER_TYPEHASH = 0x0;

    struct CrossChainOrder {
        /// @dev The contract address that the order is meant to be settled by.
        /// Fillers send this order to this contract address on the origin chain
        /// @notice we use bytes32 to be compatible with solana
        bytes32 settlementContract;
        /// @dev The address of the user who is initiating the swap,
        /// whose input tokens will be taken and escrowed
        /// @notice we use bytes32 to be compatible with solana
        bytes32 swapper;
        /// @dev Nonce to be used as replay protection for the order
        uint256 nonce;
        /// @dev The chainId of the origin chain
        uint32 originChainId;
        /// @dev The timestamp by which the order must be initiated
        uint32 initiateDeadline;
        /// @dev The timestamp by which the order must be filled on the destination chain
        uint32 fillDeadline;
        /** CUSTOM BYTES */
        ///@dev dest chainId
        uint32 destinationChainId;
        ///@dev dest settlement contract
        bytes32 destinationSettlementContract;
        ///@dev origin token to be pulled from user
        bytes32 originToken;
        ///@dev origin amount to be pulled from user
        uint256 originAmount;
        ///@dev destination token that the user receives
        bytes32 destinationToken;
        ///@dev destination amount that the user receives
        uint256 destinationAmount;
    }

    function getHash(CrossChainOrder calldata order) internal pure returns (bytes32) {
        return
            keccak256(
                abi.encodePacked( //
                    ORDER_TYPEHASH,
                    order.settlementContract,
                    order.swapper,
                    order.nonce,
                    order.originChainId,
                    order.initiateDeadline,
                    order.fillDeadline,
                    order.destinationChainId,
                    order.destinationSettlementContract,
                    order.originToken,
                    order.originAmount,
                    order.destinationToken,
                    order.destinationAmount
                )
            );
    }
}
