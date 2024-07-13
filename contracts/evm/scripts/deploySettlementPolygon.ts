
import { ethers } from "hardhat";
import { Settlement__factory } from "../types";
import { ChainId, ENDPOINT_ADDRESSES } from "./dataMappings";

async function main() {
    const accounts = await ethers.getSigners()
    const operator = accounts[0]
    const chainId = ChainId.POLYGON
    const endpoint = ENDPOINT_ADDRESSES[chainId]
    const settlement = await new Settlement__factory(operator).deploy(
        endpoint,
        operator.address
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
