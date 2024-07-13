
import { ethers } from "hardhat";
import { Settlement, Settlement__factory } from "../types";
import { ChainId, ENDPOINT_IDS, SETTLEMENT_ADDRESSES } from "./dataMappings";
import { padAddress } from "../test/utils";

async function main() {
    const [operator] = await ethers.getSigners()
    const chainId = ChainId.POLYGON
    // get settlement contract
    const settlement: Settlement = await new Settlement__factory(operator).attach(SETTLEMENT_ADDRESSES[chainId]) as any

    // add peers
    let dstChain = ChainId.MANTLE
    // await settlement.call.setPeer(ENDPOINT_IDS[dstChain], padAddress(SETTLEMENT_ADDRESSES[dstChain]))
    let tx = await settlement.setPeer(ENDPOINT_IDS[dstChain], padAddress(SETTLEMENT_ADDRESSES[dstChain]))
    console.log("hash", tx.hash)
    await tx.wait()
    //     dstChain = ChainId.ARBITRUM.
    //     tx = await settlement.setPeer(ENDPOINT_IDS[chainId], padAddress(SETTLEMENT_ADDRESSES[dstChain]))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
