
import { ethers } from "hardhat";

async function main() {
    const accounts = await ethers.getSigners()
    const operator = accounts[1]
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
