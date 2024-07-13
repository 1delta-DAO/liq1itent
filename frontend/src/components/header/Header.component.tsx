import React, { FunctionComponent } from "react";
import { MenuComponent } from "../menu/Menu.component";

import styles from "./Header.module.scss";

interface HeaderProps {
  title: string;
  subTitle: string;
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
        <MenuComponent />
      </div>
    </header>
  );
};
