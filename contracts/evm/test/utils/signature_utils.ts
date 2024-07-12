import { hexUtils } from '@0x/utils';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import * as ethers from 'ethers';

/**
 * Represents a raw EC signature.
 */
export interface ECSignature {
    v: number;
    r: string;
    s: string;
}

/**
 * ABI definition for the `Signature` struct.
 */
export const SIGNATURE_ABI = [
    { name: 'signatureType', type: 'uint8' },
    { name: 'v', type: 'uint8' },
    { name: 'r', type: 'bytes32' },
    { name: 's', type: 'bytes32' },
];

/**
 * Sign a hash with the EthSign signature type on a provider.
 */
export async function ethSignHashWithProviderAsync(
    hash: string,
    signer: SignerWithAddress,
): Promise<ECSignature> {
    const rpcSig = await signer.signMessage(ethers.getBytes(hash));
    return parseRpcSignature(rpcSig)
}

// Parse a hex signature returned by an RPC call into an `ECSignature`.
export function parseRpcSignature(rpcSig: string): ECSignature {
    if (hexUtils.size(rpcSig) !== 65) {
        throw new Error(`Invalid RPC signature length: "${rpcSig}"`);
    }
    // Some providers encode V as 0,1 instead of 27,28.
    const VALID_V_VALUES = [0, 1, 27, 28];
    // Some providers return the signature packed as V,R,S and others R,S,V.
    // Try to guess which encoding it is (with a slight preference for R,S,V).
    let v = parseInt(rpcSig.slice(-2), 16);
    if (VALID_V_VALUES.includes(v)) {
        // Format is R,S,V
        v = v >= 27 ? v : v + 27;
        return {
            r: hexUtils.slice(rpcSig, 0, 32),
            s: hexUtils.slice(rpcSig, 32, 64),
            v,
        };
    }
    // Format should be V,R,S
    v = parseInt(rpcSig.slice(2, 4), 16);
    if (!VALID_V_VALUES.includes(v)) {
        throw new Error(`Cannot determine RPC signature layout from V value: "${rpcSig}"`);
    }
    v = v >= 27 ? v : v + 27;
    return {
        v,
        r: hexUtils.slice(rpcSig, 1, 33),
        s: hexUtils.slice(rpcSig, 33, 65),
    };
}
