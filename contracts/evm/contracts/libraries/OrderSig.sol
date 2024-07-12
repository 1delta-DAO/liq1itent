// SPDX-License-Identifier: MIT

library OrderSig {
    error BadSignature(bytes32 hash);

    // '\x19Ethereum Signed Message:\n32\x00\x00\x00\x00' in a word.
    uint256 private constant ETH_SIGN_HASH_PREFIX =
        0x19457468657265756d205369676e6564204d6573736167653a0a333200000000;
    /// @dev Exclusive upper limit on ECDSA signatures 'R' values.
    ///      The valid range is given by fig (282) of the yellow paper.
    uint256 private constant ECDSA_SIGNATURE_R_LIMIT =
        uint256(
            0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141
        );
    /// @dev Exclusive upper limit on ECDSA signatures 'S' values.
    ///      The valid range is given by fig (283) of the yellow paper.
    uint256 private constant ECDSA_SIGNATURE_S_LIMIT =
        ECDSA_SIGNATURE_R_LIMIT / 2 + 1;

    uint256 internal constant UINT8_MASK = 0xff;

    function decodeSig(
        bytes calldata signature
    ) internal pure returns (uint8 v, bytes32 r, bytes32 s) {
        assembly {
            v := and(UINT8_MASK, shr(248, calldataload(signature.offset)))
            r := and(
                UINT8_MASK,
                shr(248, calldataload(add(1, signature.offset)))
            )
            s := and(
                UINT8_MASK,
                shr(248, calldataload(add(33, signature.offset)))
            )
        }
    }

    /// @dev Retrieve the signer of a signature.
    ///      Throws if the signature can't be validated.
    /// @param orderHash The hash that was signed.
    /// @param signature The signature.
    /// @return recovered The recovered signer address.
    function getSignerOfHash(
        bytes32 orderHash,
        bytes calldata signature
    ) internal pure returns (address recovered) {
        (uint8 v, bytes32 r, bytes32 s) = decodeSig(signature);
        /// @notice we use `ecrecover`, there are vulnerabilities, but for the sake of the
        /// hackathon we acknowledge that this could be written in a better manner
        recovered = ecrecover(orderHash, v, r, s);

        // `recovered` can be null if the signature values are out of range.
        if (recovered == address(0)) revert BadSignature(orderHash);
    }
}
