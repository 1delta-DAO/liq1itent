/* eslint-disable */
import React, { FunctionComponent } from "react";
import { ConnectButtonComponent } from "../button/buttons/connect-button/ConnectButton.component";

import styles from "./Header.module.scss";

interface HeaderProps {
  title: string;
  subTitle: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loggedIn: boolean;
}

export const HeaderComponent: FunctionComponent<HeaderProps> = (
  props: HeaderProps
): JSX.Element => {
  return (
    <header>
      <div className={styles["header-wrapper"]}>
        <div className={styles["header-title"]}>
          <div className={styles["main-title"]}>{props.title}</div>
        </div>
        <div className={styles["connect"]}>
          <ConnectButtonComponent login={props.login} logout={props.logout} loggedIn={props.loggedIn} />
        </div>      
      </div>
    </header>
  );
};
