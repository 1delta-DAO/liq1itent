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

    /// @title ResolvedCrossChainOrder type
    /// @notice An implementation-generic representation of an order
    /// @dev Defines all requirements for filling an order by unbundling the implementation-specific orderData.
    /// @dev Intended to improve integration generalization by allowing fillers to compute the exact input and output information of any order
    struct ResolvedCrossChainOrder {
        /// @dev The contract address that the order is meant to be settled by.
        bytes32 settlementContract;
        /// @dev The address of the user who is initiating the swap
        bytes32 swapper;
        /// @dev Nonce to be used as replay protection for the order
        uint256 nonce;
        /// @dev The chainId of the origin chain
        uint32 originChainId;
        /// @dev The timestamp by which the order must be initiated
        uint32 initiateDeadline;
        /// @dev The timestamp by which the order must be filled on the destination chain(s)
        uint32 fillDeadline;
        /// @dev The inputs to be taken from the swapper as part of order initiation
        Input[] swapperInputs;
        /// @dev The outputs to be given to the swapper as part of order fulfillment
        Output[] swapperOutputs;
        /// @dev The outputs to be given to the filler as part of order settlement
        Output[] fillerOutputs;
    }

    /// @notice Tokens sent by the swapper as inputs to the order
    struct Input {
        /// @dev The address of the ERC20 token on the origin chain
        bytes32 token;
        /// @dev The amount of the token to be sent
        uint256 amount;
    }

    /// @notice Tokens that must be receive for a valid order fulfillment
    struct Output {
        /// @dev The address of the ERC20 token on the destination chain
        /// @dev address(0) used as a sentinel for the native token
        bytes32 token;
        /// @dev The amount of the token to be sent
        uint256 amount;
        /// @dev The address to receive the output tokens
        bytes32 recipient;
        /// @dev The destination chain for this output
        uint32 chainId;
    }

    function getHash(
        CrossChainOrder calldata order
    ) internal pure returns (bytes32) {
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
