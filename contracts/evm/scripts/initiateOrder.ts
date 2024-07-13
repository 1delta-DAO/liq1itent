
import { ethers } from "hardhat";
import { ChainId, SETTLEMENT_ADDRESSES, WRAPPED_NATIVE } from "./dataMappings";
import { getHash, getOrder, padAddress } from "../test/utils";
import { getPackedSig } from "../test/utils/signature_utils";
import { Settlement, Settlement__factory } from "../types";

const amount = 1e12

// define order
const order = {
    settlementContract: '0x0000000000000000000000004504b7813782F3d93bAD6b8610fC36D311d29D6d',
    swapper: '0x00000000000000000000000045a000c10ae9ACd6dA466F650a2D80Cb38620117',
    nonce: 81797000666174290094n,
    originChainId: 5000,
    destinationChainId: 137,
    originAmount: 1000000000000n,
    destinationAmount: 1000000000000n,
    fillDeadline: 1720994527,
    destinationToken: '0x0000000000000000000000000d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    originToken: '0x00000000000000000000000078c1b0C915c4FAA5FffA6CAbf0219DA63d7f4cb8',
    initiateDeadline: 1720994527,
    destinationSettlementContract: '0x000000000000000000000000c2E6D5F04D8CCf6e79e8cA20e526ba06196b2e31',
    destinationReceiver: '0x00000000000000000000000045a000c10ae9ACd6dA466F650a2D80Cb38620117'
}

const signature = '0x1cd16d3556ad8e5f4cd686c92057feed349754fd3ab3ab79c4f8c67ed56d81a4542fbd0573d5a94526e44e86823b040ad26ac6a6ff552b41593172098f54ce4f16'

async function main() {
    const [operator] = await ethers.getSigners()
    const chainId = ChainId.MANTLE
    // get settlement contract
    const settlement: Settlement = await new Settlement__factory(operator).attach(SETTLEMENT_ADDRESSES[chainId]) as any

    // swapper signs order on origin chai
    const tx = await settlement.initiate(order, signature, '0x')
    await tx.wait()
    console.log("signature", signature)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
