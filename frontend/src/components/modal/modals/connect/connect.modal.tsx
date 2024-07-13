import React, { FunctionComponent } from "react";

import { GenericModalProps, ModalHook, useModal } from "../../Modal.component";
import { ConnectorNames, walletConfigs } from "./connectors";
import styles from "./connect.module.scss";
import { useAuth } from "../../../../contexts/authentication.context";

export const ConnectModalComponent: FunctionComponent<GenericModalProps> = ({
  onClose,
}: GenericModalProps) => {
  const { login } = useAuth();

  const connect = (connectorName: ConnectorNames) => (): void => {
    login(connectorName);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={styles["connect"]}>
      {walletConfigs
        .filter((wallet) =>
          window.innerWidth > 1024 ? wallet.desktop : wallet.mobile
        )
        .map((walletConfig) => (
          <button
            key={walletConfig.title}
            className={styles["wallet-connection"]}
            onClick={connect(walletConfig.connector)}>
            <div>{walletConfig.title}</div>
            <div className={styles["wallet-icon"]}>
              <img src={walletConfig.icon} alt={walletConfig.title} />
            </div>
          </button>
        ))}
    </div>
  );
};

export const useConnectModal = (): ModalHook =>
  useModal("Connect wallet", <ConnectModalComponent />);
