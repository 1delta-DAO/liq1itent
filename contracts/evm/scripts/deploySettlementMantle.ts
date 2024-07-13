
import { ethers } from "hardhat";
import { Settlement__factory } from "../types";
import { ChainId, ENDPOINT_ADDRESSES } from "./addresses";

async function main() {
    const accounts = await ethers.getSigners()
    const operator = accounts[0]

    const mantleEndpoint = ENDPOINT_ADDRESSES[ChainId.MANTLE]
    const settlement = await new Settlement__factory(operator).deploy(
        mantleEndpoint,
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
