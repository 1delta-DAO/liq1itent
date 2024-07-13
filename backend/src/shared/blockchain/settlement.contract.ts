import { ChainId } from "../../model/chains.enum";
import { blockchainsConfig } from "../../config/blockchains.config";
import { Settlement } from "../../types";
import { ethers } from "ethers";

import * as SettlementAbi from "../../abi/Settlement.json";

export function getSettlementContract(
  chainId: ChainId,
  provider: ethers.providers.Provider
): Settlement | undefined {
  const settlementContractAddress =
    blockchainsConfig[chainId].settlementAddress;
  if (!settlementContractAddress) {
    console.log("No settlement contract address found for chainId", chainId);
    return undefined;
  }
  // console.log("SettlementAbi", SettlementAbi);
  console.log(chainId, settlementContractAddress, "settlementContractAddress");
  const settlementContract = new ethers.Contract(
    settlementContractAddress,
    SettlementAbi,
    provider
  );
  console.log(settlementContract.address, "settlementContract.address");
  return settlementContract as Settlement;
}
