import { Settlement } from "./../../types/contracts/Settlement";
import { JsonRpcProvider } from "ethers";
import { ChainId } from "../../model/chains.enum";
import { blockchainsConfig } from "../../config/blockchains.config";
import { Settlement__factory } from "../../types";

export async function getSettlementContract(
  chainId: ChainId,
  provider: JsonRpcProvider
) {
  const signer = await provider.getSigner();
  return new Settlement__factory(signer).attach(
    blockchainsConfig[chainId].settlementAddress
  );
}
