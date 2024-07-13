
import { ethers } from "hardhat";
import { ChainId, ENDPOINT_IDS, SETTLEMENT_ADDRESSES, WRAPPED_NATIVE } from "./dataMappings";
import { getHash, padAddress } from "../test/utils";
import { Settlement, Settlement__factory, WETH9, WETH9__factory } from "../types";
import { orderSample } from "./order";
import { Options } from "@layerzerolabs/lz-v2-utilities";
import { solidityPacked } from "ethers";


let defaultAdapterParams = solidityPacked(["uint16", "uint256"], [1, 200000])

async function main() {
    const [operator] = await ethers.getSigners()
    console.log("operator", operator.address)
    const chainId = ChainId.POLYGON

    const token: WETH9 = await new WETH9__factory(operator).attach(WRAPPED_NATIVE[chainId]) as any

    // console.log("approve")
    // let tx = await token.approve(SETTLEMENT_ADDRESSES[chainId], orderSample.destinationAmount)
    // await tx.wait()

    // console.log("deposit")
    // await token.deposit({ value: orderSample.destinationAmount })
    // await tx.wait()

    // get settlement contract
    const settlement: Settlement = await new Settlement__factory(operator).attach(SETTLEMENT_ADDRESSES[chainId]) as any

    const options = Options.newOptions().addExecutorLzReceiveOption(650000, 0).toHex().toString()

    const testMessage = solidityPacked(['bytes32', 'bytes32'], [getHash(orderSample), padAddress(operator.address)])
    // Define native fee and quote for the message send operation

    console.log("calldata", Settlement__factory.createInterface().encodeFunctionData("quote",
        [ENDPOINT_IDS[ChainId.MANTLE], testMessage, options, false]
    ))
    let nativeFee = 0n;
    try {
        ;[nativeFee] = await settlement.quote.staticCall(ENDPOINT_IDS[ChainId.MANTLE], testMessage, options, false)
    } catch (e: any) {
        console.log(Object.keys(e))
        console.log(e.data)
        console.log(e.code)
        console.log(e.name)
        console.log(e._stack)
        console.log(e.parent)
    }
    console.log("settle with fee", nativeFee)
    // swapper signs order on origin chai
    let tx2 = await settlement.settle(
        padAddress(operator.address),
        orderSample,
        defaultAdapterParams,
        { value: nativeFee }
    )
    await tx2.wait()
    console.log("settled")
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
