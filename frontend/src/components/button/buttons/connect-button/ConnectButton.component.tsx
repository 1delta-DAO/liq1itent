import React, { useEffect, useMemo } from "react";
import { useWeb3React } from "@web3-react/core";

import { ButtonComponent } from "../../Button.component";
import { useConnectModal } from "../../../modal/modals/connect/connect.modal";
import { useAccountInfoModal } from "../../../modal/modals/account/account-info.modal";
import { getNetwork } from "../../../../config/networks.config";

import styles from "./ConnectButton.module.scss";

export const ConnectButtonComponent: React.FC = () => {
  const { showModal: showConnectModal } = useConnectModal();
  const { showModal: showAccountInfoModal } = useAccountInfoModal();
  const { account, chainId, error, deactivate } = useWeb3React();

  const mobileSize = 768;

  useEffect(() => {
    if (chainId && getNetwork(chainId) === undefined) {
      deactivate();
    }
  }, [chainId, deactivate, error]);

  const shortenedAccount = useMemo(
    () =>
      account
        ? window.innerWidth > mobileSize
          ? `${account.slice(0, 4)}...${account.slice(account.length - 4)}`
          : `${account.slice(0, 7)}`
        : null,
    [account]
  );

  const chainIcon = useMemo(() => {
    if (!chainId) return undefined;
    const network = getNetwork(chainId);
    if (network) {
      return network.icon;
    }
    return undefined;
  }, [chainId]);

  return (
    <div className={styles["connect"]}>
      {!shortenedAccount ? (
        <ButtonComponent text={"CONNECT"} onClick={showConnectModal} />
      ) : (
        <ButtonComponent
          icon={window.innerWidth > mobileSize ? chainIcon : undefined}
          text={shortenedAccount}
          onClick={showAccountInfoModal}
        />
      )}
    </div>
  );
};
