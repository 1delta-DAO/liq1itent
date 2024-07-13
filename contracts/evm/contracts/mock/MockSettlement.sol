// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {Settlement} from "../Settlement.sol";

// mock version that allwos setting the chainId manually
contract MockSettlement is Settlement {
    constructor(address ep) Settlement(ep) {}

    function mockSetChainId(uint256 cId) external {
        THIS_CHAIN_ID = cId;
    }
}
