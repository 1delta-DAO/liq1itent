import { ChainId } from "../model/chains.enum";
import {
  mainnetRpcList,
  mantleRpcList,
  polygonRpcList,
  sepoliaRpcList,
} from "./rpc-list";
import { ethers } from "ethers";

export const findWorkingRpc = async (
  chainId: ChainId
): Promise<ethers.providers.JsonRpcProvider> => {
  let stop = false;
  const rpcList = blockchainsConfig[chainId].rpcs;
  while (!stop) {
    if (rpcList.filter((r) => r.isWorking === true).length === 0) {
      stop = true;
      return null;
    }
    const randomRpc =
      rpcList[
        Math.floor(Math.random() * blockchainsConfig[chainId].rpcs.length)
      ];
    const provider = ethers.getDefaultProvider(randomRpc.rpc);
    try {
      await provider.getBlockNumber();
      randomRpc.isWorking = true;
      stop = true;
      return provider as ethers.providers.JsonRpcProvider;
    } catch (error) {
      randomRpc.isWorking = false;
    }
  }
};

type BlockchainsConfig = {
  [key in ChainId]: {
    settlementAddress: string;
    fillerOracleAddress: string;
    rpcs: { rpc: string; wsRpc: string; isWorking: boolean }[];
    explorerUrl: string;
    explorerApiKey: string;
  };
};

export const blockchainsConfig: BlockchainsConfig = {
  [ChainId.mainnet]: {
    settlementAddress: "",
    fillerOracleAddress: "",
    rpcs: mainnetRpcList,
    explorerUrl: "https://api.etherscan.io/api",
    explorerApiKey: "IN9UA3RUEADNEE3IIF9IB1WJ7W6AT4VTC7",
  },
  [ChainId.sepolia]: {
    settlementAddress: "",
    fillerOracleAddress: "",
    rpcs: sepoliaRpcList,
    explorerUrl: "https://api.etherscan.io/api",
    explorerApiKey: "IN9UA3RUEADNEE3IIF9IB1WJ7W6AT4VTC7",
  },
  [ChainId.mantle]: {
    settlementAddress: "0x1d051eeD29Df13E1A1d1546329E54036A57AEb77",
    fillerOracleAddress: "",
    rpcs: mantleRpcList,
    explorerUrl: "https://explorer.mantle.xyz/api",
    explorerApiKey: "IN9UA3RUEADNEE3IIF9IB1WJ7W6AT4VTC7",
  },
  [ChainId.solana]: {
    settlementAddress: "",
    fillerOracleAddress: "",
    rpcs: sepoliaRpcList,
    explorerUrl: "https://api.etherscan.io/api",
    explorerApiKey: "IN9UA3RUEADNEE3IIF9IB1WJ7W6AT4VTC7",
  },
  [ChainId.polygon]: {
    settlementAddress: "0x1a44076050125825900e736c501f859c50fE728c",
    fillerOracleAddress: "",
    rpcs: polygonRpcList,
    explorerUrl: "https://api.etherscan.io/api",
    explorerApiKey: "IN9UA3RUEADNEE3IIF9IB1WJ7W6AT4VTC7",
  },
};
