// SPDX-License-Identifier: MIT

pragma solidity ^0.8.25;

import {OrderLib} from "../libraries/OrderLib.sol";

interface IFillerOracle {
    function reportSettlementAttempt(
        OrderLib.CrossChainOrder calldata order,
        bytes32 orderHash
    ) external;
}
