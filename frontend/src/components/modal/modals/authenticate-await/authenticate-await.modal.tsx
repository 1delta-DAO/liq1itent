import React from "react";

import {
  GenericModalProps,
  ModalHook,
  ModalOptions,
  useModal,
} from "../../Modal.component";
import { SpinnerComponent } from "../../../spinner/Spinner.component";

import styles from "./authenticate-await.module.scss";

export const AuthenticateAwaitModal: React.FC<GenericModalProps> = () => {
  return (
    <div className={styles["authenticate-await"]}>
      <SpinnerComponent size="large" />
    </div>
  );
};

export const useAuthenticateAwaitModal = (options?: ModalOptions): ModalHook =>
  useModal("Authenticating... ", <AuthenticateAwaitModal />, {
    ...options,
    disableOutsideClick: true,
  });
