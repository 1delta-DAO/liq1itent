import { useWeb3React } from "@web3-react/core";
import React, { FunctionComponent, useMemo, useState } from "react";
import { ButtonComponent } from "../../../button/Button.component";
import { GenericModalProps, ModalHook, useModal } from "../../Modal.component";
import copy from "../../../../../public/assets/images/svg/copy.svg";
import styles from "./account-info.module.scss";
import stylesbtn from "../../modal-btn.module.scss";
import { getNetwork } from "../../../../config/networks.config";
import { useAuth } from "../../../../contexts/authentication.context";

export const AccountInfoModalComponent: FunctionComponent<
  GenericModalProps
> = ({ onClose }: GenericModalProps) => {
  const { account, chainId } = useWeb3React();
  const [, setCopyText] = useState("Copy");
  const { logout } = useAuth();

  const chainData = useMemo(() => {
    const network = getNetwork(chainId);
    if (network) {
      return { icon: network.icon, name: network.name };
    }
    return undefined;
  }, [chainId]);

  const onCopy = (): void => {
    if (account) {
      void navigator.clipboard.writeText(account).then(() => {
        setCopyText("Copied !");

        setTimeout(() => {
          setCopyText("Copy");
        }, 2000);
      });
    }
  };

  const onDisconnect = (): void => {
    onClose?.();
    logout();
  };

  const accountString = (): string => {
    if (account) {
      return window.innerWidth > 768
        ? account
        : `${account.slice(0, 6)}...${account.slice(account.length - 4)}`;
    }
    return "";
  };

  return (
    <div className={styles["account-info"]}>
      <div className={styles["address"]}>
        {accountString()}
        <button className={styles["copy-button"]} onClick={onCopy}>
          <img alt="copy text" src={copy} />
        </button>
      </div>
      <div className={styles["blockchain"]}>
        Network:
        <img src={chainData?.icon} alt="chain" />
        <span>{chainData?.name}</span>
      </div>
      <div className={stylesbtn["modal-btn"]}>
        <ButtonComponent text="Disconnect" onClick={onDisconnect} />
      </div>
    </div>
  );
};

export const useAccountInfoModal = (): ModalHook =>
  useModal("Your account", <AccountInfoModalComponent />);
