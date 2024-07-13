
import { ethers } from "hardhat";
import { Settlement__factory } from "../types";
import { ChainId, ENDPOINT_IDS, SETTLEMENT_ADDRESSES } from "./addresses";
import { padAddress } from "../test/utils";

async function main() {
    const [operator] = await ethers.getSigners()
    const chainId = ChainId.MANTLE
    // get settlement contract
    const settlement = new Settlement__factory(operator).attach(SETTLEMENT_ADDRESSES[chainId])

    // add peers
    let dstChain = ChainId.POLYGON
    let tx = await settlement.setPeer(ENDPOINT_IDS[dstChain], padAddress(SETTLEMENT_ADDRESSES[dstChain]))
    dstChain = ChainId.ARBITRUM
    tx = await settlement.setPeer(ENDPOINT_IDS[chainId], padAddress(SETTLEMENT_ADDRESSES[dstChain]))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
