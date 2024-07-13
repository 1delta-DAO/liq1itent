import { JsonRpcProvider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { ContractTransaction } from "ethers";
import { useCallback } from "react";
import { useTxWaitModal } from "../components/modal/modals/tx-wait/tx-wait.modal";

import { extractRevertReason, JsonRpcError } from "../utils/blockchain";
import { approve, getAllowance } from "../contracts/erc20.contract";
import { useUserPositions } from "./useUserPositions";

interface UseApprove {
  approveTokenTo: (
    amount: string,
    spenderAddress: string,
    tokenAddress: string
  ) => void;
  getAmountApprovedFor: (
    userAddress: string,
    spenderAddress: string,
    tokenAddress: string
  ) => Promise<string>;
}

export const useApprove = (): UseApprove => {
  const { library, account } = useWeb3React<JsonRpcProvider>();
  const txAwaitModal = useTxWaitModal();
  const { refresh } = useUserPositions();

  const approveTokenTo = (
    amount: string,
    spenderAddress: string,
    tokenAddress: string
  ): void => {
    if (library) {
      txAwait(approve(amount, spenderAddress, tokenAddress, library));
    }
  };

  const getAmountApprovedFor = (
    userAddress: string,
    spenderAddress: string,
    tokenAddress: string
  ): Promise<string> => {
    return getAllowance(userAddress, spenderAddress, tokenAddress);
  };

  const txAwait = useCallback(
    (tx: Promise<ContractTransaction>): void => {
      tx.then(async (tx) => {
        txAwaitModal.showModal();
        await tx.wait(1);
        txAwaitModal.closeModal();
        refresh();
      }).catch((error: JsonRpcError | { error: JsonRpcError }) => {
        const err =
          (error as { error: JsonRpcError }).error !== undefined
            ? (error as { error: JsonRpcError }).error
            : (error as JsonRpcError);
        txAwaitModal.closeModal();
        console.log(extractRevertReason(err));
      });
    },
    [txAwaitModal, refresh]
  );

  return { approveTokenTo, getAmountApprovedFor };
};
