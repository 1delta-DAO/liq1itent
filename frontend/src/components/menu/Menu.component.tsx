import React, { FunctionComponent } from "react";
import styles from "./Menu.module.scss";

import { HamburgerComponent } from "./hamburger/Hamburger.component";
import { useMenu } from "./useMenu";
import { MenuItemComponent } from "./menu-item/MenuItem.component";
import { mainMenu, MenuItem } from "./MainMenu";
import { ConnectButtonComponent } from "../button/buttons/connect-button/ConnectButton.component";

export const MenuComponent: FunctionComponent = (): JSX.Element => {
  const { isHamburgerOpen } = useMenu();

  return (
    <>
      <ul
        className={[
          styles["menu"],
          isHamburgerOpen ? styles["visible"] : "",
        ].join(" ")}>
        {mainMenu.map((item: MenuItem) => {
          return (
            <MenuItemComponent
              key={item.index}
              title={item.title}
              icon={item.icon}
              collapsible={item.collapsible}
              needsWeb3={item.needsWeb3}
              disabled={item.disabled}
              tabKey={item.tabKey}
            />
          );
        })}
      </ul>
      <div className={styles["connect"]}>
        <ConnectButtonComponent />
      </div>
      <HamburgerComponent />
    </>
  );
};
