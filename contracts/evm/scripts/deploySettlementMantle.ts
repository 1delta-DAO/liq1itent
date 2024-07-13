
import { ethers } from "hardhat";
import { Settlement__factory } from "../types";
import { solidityPacked } from "ethers";

async function main() {
    const accounts = await ethers.getSigners()
    const operator = accounts[1]

    const mantleEndpoint = '0x1a44076050125825900e736c501f859c50fE728c'
    const settlement = await new Settlement__factory(operator).deploy(
      mantleEndpoint  
    )
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
