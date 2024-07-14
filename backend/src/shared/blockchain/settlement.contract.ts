import { ChainId } from "../../model/chains.enum";
import { blockchainsConfig } from "../../config/blockchains.config";
import { Settlement } from "../../types";
import { ethers } from "ethers";

import SettlementAbi from "../../abi/Settlement.json";

export function getSettlementContract(
  chainId: ChainId,
  provider: ethers.providers.Provider | ethers.Signer
): Settlement | undefined {
  const settlementContractAddress =
    blockchainsConfig[chainId].settlementAddress;
  if (!settlementContractAddress) {
    return undefined;
  }
  const settlementContract = new ethers.Contract(
    settlementContractAddress,
    SettlementAbi,
    provider
  );
  return settlementContract as Settlement;
}
