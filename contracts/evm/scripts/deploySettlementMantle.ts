
import { ethers } from "hardhat";
import { Settlement__factory } from "../types";
import { ChainId, ENDPOINT_ADDRESSES } from "./dataMappings";

const MANTLE_CONFIGS = {
    maxFeePerGas: 0.02 * 1e9,
    maxPriorityFeePerGas: 0.02 * 1e9
}
async function main() {
    const accounts = await ethers.getSigners()
    const operator = accounts[0]

    const chainId = ChainId.MANTLE
    const endpoint = ENDPOINT_ADDRESSES[chainId]
    const settlement = await new Settlement__factory(operator).deploy(
        endpoint,
        operator.address,
        MANTLE_CONFIGS
    )
    const address = await settlement.getAddress()
    console.log("settlement address", address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
