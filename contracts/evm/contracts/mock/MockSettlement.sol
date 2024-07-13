// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {Settlement} from "../Settlement.sol";

// mock version that allwos setting the chainId manually
contract MockSettlement is Settlement {
    constructor(address ep, address d) Settlement(ep, d) {}

    function mockSetChainId(uint256 cId) external {
        THIS_CHAIN_ID = cId;
    }

    function mockSetChainIdEidPair(uint32 cId, uint32 eId) external {
        chainIdToEid[cId] = eId;
        eidToChainId[eId] = cId;
    }
}
