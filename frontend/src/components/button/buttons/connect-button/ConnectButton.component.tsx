import React, { FunctionComponent, useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { ButtonComponent } from "../../Button.component";
import { useConnectModal } from "../../../modal/modals/connect/connect.modal";
import { getNetwork } from "../../../../config/networks.config";

import styles from "./ConnectButton.module.scss";

interface ConnectButtonProps {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loggedIn: boolean;
}

export const ConnectButtonComponent: FunctionComponent<ConnectButtonProps> = (
  props: ConnectButtonProps
): JSX.Element => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(props.loggedIn);
  }, [props.loggedIn]);

  const handleLogin = (): void => {
    console.log("login");
    void props.login();
  };

  const handleLogout = (): void => {
    console.log("logout");
    void props.logout();
  };

  return (
    <div className={styles["connect"]}>
      {!loggedIn ? (
        <ButtonComponent text={"CONNECT"} onClick={handleLogin} />
      ) : (
        <ButtonComponent
          icon={undefined}
          text={"CONNECTED"}
          onClick={handleLogout}
        />
      )}
    </div>
  );
};
