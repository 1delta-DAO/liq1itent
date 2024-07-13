
import { ethers } from "hardhat";
import { Settlement__factory } from "../types";
import { ChainId, ENDPOINT_IDS, SETTLEMENT_ADDRESSES } from "./dataMappings";
import { padAddress } from "../test/utils";

async function main() {
    const [operator] = await ethers.getSigners()
    const chainId = ChainId.MANTLE
    // get settlement contract
    const settlement = await new Settlement__factory(operator).attach(SETTLEMENT_ADDRESSES[chainId])

    // add peers
    let dstChain = ChainId.POLYGON
    // await settlement.call.setPeer(ENDPOINT_IDS[dstChain], padAddress(SETTLEMENT_ADDRESSES[dstChain]))
    let tx = await settlement.setPeer(ENDPOINT_IDS[dstChain], padAddress(SETTLEMENT_ADDRESSES[dstChain]))
    await tx.wait()
    //     dstChain = ChainId.ARBITRUM
    //     tx = await settlement.setPeer(ENDPOINT_IDS[chainId], padAddress(SETTLEMENT_ADDRESSES[dstChain]))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
