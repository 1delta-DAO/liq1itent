
import { ethers } from "hardhat";
import { WETH9, WETH9__factory } from "../types";
import { ChainId, getConfig, SETTLEMENT_ADDRESSES, WRAPPED_NATIVE } from "./dataMappings";

const amount = 1e12

async function main() {
    const [operator] = await ethers.getSigners()
    const chainId = ChainId.MANTLE

    const config = getConfig(chainId)

    const token: WETH9 = await new WETH9__factory(operator).attach(WRAPPED_NATIVE[chainId]) as any
    let tx = await token.deposit({ ...config, value: amount },)
    await tx.wait()

    tx = await token.approve(SETTLEMENT_ADDRESSES[chainId], amount, config)
    await tx.wait()
    console.log("finished")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
