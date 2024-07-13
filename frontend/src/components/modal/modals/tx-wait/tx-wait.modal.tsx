import React from "react";

import {
  GenericModalProps,
  ModalHook,
  ModalOptions,
  useModal,
} from "../../Modal.component";
import { SpinnerComponent } from "../../../spinner/Spinner.component";

import styles from "./tx-wait.module.scss";

export const TxAwaitModal: React.FC<GenericModalProps> = () => {
  return (
    <div className={styles["tx-wait-modal"]}>
      <p>Your transaction is being processed...</p>
      <SpinnerComponent size="large" />
    </div>
  );
};

export const useTxWaitModal = (options?: ModalOptions): ModalHook =>
  useModal("Waiting for transaction", <TxAwaitModal />, {
    ...options,
    disableOutsideClick: true,
  });
