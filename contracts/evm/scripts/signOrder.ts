
import { ethers } from "hardhat";
import { ChainId, WRAPPED_NATIVE } from "./dataMappings";
import { getHash, getOrder, padAddress } from "../test/utils";
import { getPackedSig } from "../test/utils/signature_utils";

const amount = 1e12

// define order
const order = (user: string, from: number, to: number) => getOrder({
    swapper: padAddress(user),
    originChainId: from,
    originToken: padAddress(WRAPPED_NATIVE[from]),
    destinationToken: padAddress(WRAPPED_NATIVE[to]),
    destinationReceiver: padAddress(user),
    originAmount: BigInt(amount),
    destinationAmount: BigInt(amount),
    destinationChainId: to
})
async function main() {
    const [operator] = await ethers.getSigners()
    const chainId = ChainId.MANTLE
    const destChainId = ChainId.POLYGON
    const preppedOrder = order(operator.address, chainId, destChainId)
    const hash = getHash(preppedOrder)

    // swapper signs order on origin chai
    const signature = await getPackedSig(hash, operator)
    console.log("signature", signature)
    console.log("order", preppedOrder)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
