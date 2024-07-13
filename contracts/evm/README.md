# liq1itent - evm settlement contracts

## Order definition is an interpretations ERC-7683

We try to extend ERC-7683 by also considering Cross-Chain orders for non-EVMs.

To make this work, we use `bytes32` instead of `address` as non-evms like Solana use 32-bytes addresses.

On top of this, one needs to think of a better identifier than just `chainId` since non-EVMs are not necessarily identified like that.

## Setup

Install: `yarn`
Compile: `npx hardhat compile`

## Tests

The tests show 
1) that the user can sign an order that is correcly validateable.
2) that a filler can pick up the order and initiate the filling process.
3) that the filler can only trigger abn unlock of the user sell amount if the layer zero message is successfully received on the origin chain.

The test can be run with `npx hardhat test`

Sometimes the hardhat state has to be cleaned up before the run with `npx hardhat clean`