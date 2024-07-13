import { ethers } from "hardhat";
import { AbiCoder, Contract } from 'ethers';
import { ChainId, ENDPOINT_IDS } from "../dataMappings";
import { CONFIG_ABI } from "./abi";


const sourceMessageLibAddresses = ['0x8da6512De9379fBF4F09BF520Caf7a85435ed93e'];
const oappAddress = '0x1d051eeD29Df13E1A1d1546329E54036A57AEb77';
const REMOTE_CHAIN_ENDPOINT_ID = ENDPOINT_IDS[ChainId.POLYGON]; // polygon


const confirmations = 2;
const optionalDVNThreshold = 0;
const requiredDVNs = ["0x28B6140ead70cb2Fb669705b3598ffB4BEaA060b"];
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
    const endpointContract = new Contract( '0x1a44076050125825900e736c501f859c50fE728c' ,  CONFIG_ABI, a );

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
      }}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
