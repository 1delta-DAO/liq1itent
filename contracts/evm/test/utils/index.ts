import { BigNumberish, getAddress, keccak256, MaxUint256, solidityPacked } from "ethers";
import { randomBytes } from "crypto";

export interface CrossChainOrder {
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

const ORDER_TYPEHASH = '0x7d67a4f66acd55f74f30ad361a692350d3913711c2166ea7b7dd1e6b8c4dcf30'

const orderTypes = [
    'bytes32',
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

const ADDRESS_MASK = BigInt("0x000000000000000000000000ffffffffffffffffffffffffffffffffffffffff");

// Create reandom EVM address
function randomAddress(): string {
    return getAddress(randomBytes(20).toString('hex'));
}

export function padAddress(addr: string) {
    return addr.replace('0x', '0x000000000000000000000000')
}

function randomPaddedAddress() {
    return padAddress(randomAddress())
}

export function createExpiry(deltaSeconds = 60): number {
    return Math.floor(Date.now() / 1000) + deltaSeconds;
}

const DEFAULT_EXPIRY = 10000


export function getRandomInteger(min: BigNumberish, max: BigNumberish): bigint {
    const range = BigInt(max) - BigInt(min);
    const bts = BigInt('0x' + randomBytes(32).toString('hex'))
    return BigInt(min) + range * bts / MaxUint256;
}

export function getOrder(opts: Partial<CrossChainOrder> = {}): CrossChainOrder {
    return {
        settlementContract: randomPaddedAddress(),
        swapper: randomPaddedAddress(),
        nonce: getRandomInteger(1e18, 100e18),
        originChainId: 1,
        destinationChainId: 1,
        originAmount: getRandomInteger(1e18, 100e18),
        destinationAmount: getRandomInteger(1e18, 100e18),
        fillDeadline: createExpiry(DEFAULT_EXPIRY),
        destinationToken: randomPaddedAddress(),
        originToken: randomPaddedAddress(),
        initiateDeadline: createExpiry(DEFAULT_EXPIRY),
        destinationSettlementContract: randomPaddedAddress(),
        destinationReceiver: randomPaddedAddress(),
        ...opts
    }
}