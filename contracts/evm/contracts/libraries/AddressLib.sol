// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;


/** Convert a bytes32 object to an evm address (lower 20 bytes) */
library AddressLib {
    function toEvmAddress(
        bytes32 encodedAddress
    ) internal pure returns (address extractedAddress) {
        // assembly auto-pads the address correctly
        assembly {
            extractedAddress:= encodedAddress
        }
    }
}
