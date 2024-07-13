import { ChainId } from "../model/chains.enum";
import { mainnetRpcList, sepoliaRpcList } from "./rpc-list";
import { ethers } from "ethers";

export const findWorkingRpc = async (
  chainId: ChainId
): Promise<{ rpc: string; wsRpc: string }> => {
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
      return randomRpc;
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
    settlementAddress: "",
    fillerOracleAddress: "",
    rpcs: sepoliaRpcList,
    explorerUrl: "https://api.etherscan.io/api",
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
    settlementAddress: "",
    fillerOracleAddress: "",
    rpcs: sepoliaRpcList,
    explorerUrl: "https://api.etherscan.io/api",
    explorerApiKey: "IN9UA3RUEADNEE3IIF9IB1WJ7W6AT4VTC7",
  },
};
