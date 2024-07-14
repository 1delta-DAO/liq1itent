
import { ethers } from "hardhat";
import { ChainId, SETTLEMENT_ADDRESSES } from "./dataMappings";
import { Settlement, Settlement__factory } from "../types";
import { orderSample, signatureSample } from "./order";

async function main() {
    const [operator] = await ethers.getSigners()
    const chainId = ChainId.MANTLE
    // get settlement contract
    const settlement: Settlement = await new Settlement__factory(operator).attach(SETTLEMENT_ADDRESSES[chainId]) as any

    // swapper signs order on origin chai
    const tx = await settlement.initiate(orderSample, signatureSample, '0x')
    await tx.wait()
    console.log("tx.hash", tx.hash)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
