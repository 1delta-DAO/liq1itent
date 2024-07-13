import { ethers } from "hardhat";
import { AbiCoder, Contract } from 'ethers';
import { ChainId, ENDPOINT_IDS } from "../dataMappings";
import { CONFIG_ABI } from "./abi";

const sourceMessageLibAddresses = ['0x6c26c61a97006888ea9E4FA36584c7df57Cd9dA3'];
const oappAddress = '0x1280Bdbe692fA1ae7b69B9356daD6Cc211cbEA41';
const REMOTE_CHAIN_ENDPOINT_ID = ENDPOINT_IDS[ChainId.MANTLE]; // mantle


const confirmations = 2;
const optionalDVNThreshold = 0;
const requiredDVNs = ["0x23DE2FE932d9043291f870324B74F820e11dc81A"];
const optionalDVNs: any[] = [];
const requiredDVNCount = requiredDVNs.length;
const optionalDVNCount = optionalDVNs.length;
// Configuration type
const configTypeUln = 2; // As defined for CONFIG_TYPE_ULN

const ulnConfigStructType =
  'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)';

const ulnConfigData = {
  confirmations,
  requiredDVNCount,
  optionalDVNCount,
  optionalDVNThreshold,
  requiredDVNs,
  optionalDVNs,
};

console.log({
  ulnConfigData
})
const ulnConfigEncoded = (new AbiCoder()).encode(
  [ulnConfigStructType],
  [ulnConfigData],
);


async function main() {

  console.log("tsest")
  const [a] = await ethers.getSigners();
  console.log("test")
  const endpointContract = new Contract('0x1a44076050125825900e736c501f859c50fE728c', CONFIG_ABI, a);

  const setConfigParamUln = {
    eid: REMOTE_CHAIN_ENDPOINT_ID, // Replace with your remote chain's endpoint ID (source or destination)
    configType: configTypeUln,
    config: ulnConfigEncoded,
  };

  console.log({
    setConfigParamUln
  })

  for (const libAddress of sourceMessageLibAddresses) {
    const callResult = await endpointContract.setConfig(oappAddress, libAddress, [setConfigParamUln]);
    console.log({
      callResult
    })
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
