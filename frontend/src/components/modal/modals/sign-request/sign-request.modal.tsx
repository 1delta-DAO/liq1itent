import React from "react";

import {
  GenericModalProps,
  ModalHook,
  ModalOptions,
  useModal,
} from "../../Modal.component";
import { SpinnerComponent } from "../../../spinner/Spinner.component";

import styles from "./sign-request.module.scss";

export const SignRequestModal: React.FC<GenericModalProps> = () => {
  return (
    <div className={styles["sign-request"]}>
      <p>
        A transaction is pending, please sign this transaction in your metamask
        pop-up
      </p>
      <SpinnerComponent size="large" />
    </div>
  );
};

export const useSignRequestModal = (options?: ModalOptions): ModalHook =>
  useModal("Waiting for sign", <SignRequestModal />, {
    ...options,
    disableOutsideClick: true,
  });
