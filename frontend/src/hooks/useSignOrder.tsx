import { JsonRpcProvider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useTxWaitModal } from "../components/modal/modals/tx-wait/tx-wait.modal";
import {
  CrossChainOrder,
  getHash,
  getOrder,
  padAddress
} from "../utils/order";
import { getPackedSig } from "../utils/signature_utils";
import Web3 from "web3";
import { RegisteredSubscription } from "web3-eth";

interface UseSignOrder {
  signOrder: (
    order: CrossChainOrder
  ) => Promise<string>;
  constructOrder: (
    userAddress: string,
    amountIn: string,
    amountOut: string,
    assetIn: string,
    assetOut: string,
    chainIdIn: string,
    chainIdOut: string
  ) => CrossChainOrder;
}

export const useSignOrder = (): UseSignOrder => {
  const { library, account } = useWeb3React<JsonRpcProvider>();
  const txAwaitModal = useTxWaitModal();

  async function signOrder(
    order: CrossChainOrder
  ): Promise<string> {
    if (library) {
      const hash = getHash(order)
      return await getPackedSig(hash, library)
    }
    return '0x'
  };

  async function signOrderWithProvider(
    order: CrossChainOrder,
    provider: Web3<RegisteredSubscription>,
  ): Promise<string> {
    const hash = getHash(order)
    const fromAddress = (await provider.eth.getAccounts())[0]

    const signedMessage = fromAddress ? await provider.eth.personal.sign(
      hash,
      fromAddress,
      'test password!'
    ) : "";

    return signedMessage;
  };

  const constructOrder = (
    userAddress: string,
    amountIn: string,
    amountOut: string,
    assetIn: string,
    assetOut: string,
    chainIdIn: string, // we hard code that
    chainIdOut: string
  ): CrossChainOrder => {
    return getOrder({
      swapper: padAddress(userAddress),
      originAmount: BigInt(amountIn),
      destinationAmount: BigInt(amountOut),
      originChainId: 5000,
      destinationChainId: 137,
      originToken: padAddress(assetIn),
      destinationToken: padAddress(assetOut),
    });
  };

  return { signOrder, constructOrder };
};
