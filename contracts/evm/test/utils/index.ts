import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { keccak256, solidityPacked } from "ethers";
import { ECSignature, ethSignHashWithProviderAsync } from "./signature_utils";

interface CrossChainOrder {
    /// @dev The contract address that the order is meant to be settled by.
    /// Fillers send this order to this contract address on the origin chain
    /// @notice we use bytes32 to be compatible with solana
    settlementContract: string;
    /// @dev The address of the user who is initiating the swap,
    /// whose input tokens will be taken and escrowed
    /// @notice we use bytes32 to be compatible with solana
    swapper: string;
    /// @dev Nonce to be used as replay protection for the order
    nonce: bigint;
    /// @dev The chainId of the origin chain
    originChainId: number;
    /// @dev The timestamp by which the order must be initiated
    initiateDeadline: number;
    /// @dev The timestamp by which the order must be filled on the destination chain
    fillDeadline: number;
    /** CUSTOM BYTES */
    ///@dev dest chainId
    destinationChainId: number;
    ///@dev dest address
    destinationReceiver: string;
    ///@dev dest settlement contract
    destinationSettlementContract: string;
    ///@dev origin token to be pulled from user
    originToken: string;
    ///@dev origin amount to be pulled from user
    originAmount: bigint;
    ///@dev destination token that the user receives
    destinationToken: string;
    ///@dev destination amount that the user receives
    destinationAmount: bigint;
}

const ORDER_TYPEHASH = '0x0'

const orderTypes = [
    'bytes32',
    'bytes32',
    'uint256',
    'uint32',
    'uint32',
    'uint32',
    'uint32',
    'bytes32',
    'bytes32',
    'bytes32',
    'uint256',
    'bytes32',
    'uint256',
]

export function getHash(order: CrossChainOrder) {
    return keccak256(solidityPacked(
        orderTypes,
        [
            ORDER_TYPEHASH,
            order.settlementContract,
            order.swapper,
            order.nonce,
            order.originChainId,
            order.initiateDeadline,
            order.fillDeadline,
            order.destinationChainId,
            order.destinationReceiver,
            order.destinationSettlementContract,
            order.originToken,
            order.originAmount,
            order.destinationToken,
            order.destinationAmount
        ]
    ))
}


export async function signOrder(
    order: CrossChainOrder,
    signer: SignerWithAddress): Promise<ECSignature> {
    return await ethSignHashWithProviderAsync(getHash(order), signer)
}