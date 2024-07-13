import {
  BigNumber,
  Contract,
  ContractInterface,
  providers,
  utils,
} from "ethers";
import { getNetwork } from "../config/networks.config";

type JsonRpcErrorData =
  | { message: string }
  | { originalError: { message: string } };

export type JsonRpcError = {
  code: number;
  message: string;
  data?: JsonRpcErrorData;
};

export const getContract = <T extends Contract>(
  abi: ContractInterface,
  address: string,
  chainId: number
): T => {
  const provider = getProvider(chainId);
  return new Contract(address, abi).connect(provider) as T;
};

export const extractRevertReason = (error: JsonRpcError): string => {
  const message =
    (error.data as { message: string })?.message ||
    (error.data as { originalError: { message: string } })?.originalError
      ?.message ||
    error.message;

  if (message) {
    return (
      // eslint-disable-next-line max-len
      /(Error: VM Exception while processing transaction: reverted with reason string|execution reverted:|MetaMask Tx Signature:) (.*)/
        .exec(message)?.[2]
        ?.replace(/'/g, "")
        .trim() || "Unknown revert reason"
    );
  }
  return "Unknown revert reason";
};

export const getProvider = (chainId: number): providers.Provider => {
  return new providers.JsonRpcProvider(getNetwork(chainId).rpc);
};

export const bigNumberToNumber = (
  number: BigNumber,
  decimals: number
): number => {
  return Number(utils.formatUnits(number, decimals));
};

export const convertToBigNumber = (number: number): BigNumber => {
  return utils.parseUnits(number.toString(), 18);
};
