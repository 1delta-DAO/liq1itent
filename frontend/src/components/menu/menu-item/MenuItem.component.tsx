import React, { FunctionComponent } from "react";
import cx from "classnames";
import styles from "./MenuItem.module.scss";
import { TabKeys } from "../../../data/tabs";
import { useMenu } from "../useMenu";
import { useConnectModal } from "../../modal/modals/connect/connect.modal";
import { useWeb3React } from "@web3-react/core";
import { JsonRpcProvider } from "@ethersproject/providers";

export interface DropDown {
  index: number;
  open: boolean;
  renderArrow: boolean;
  itemsFunction: () => JSX.Element;
}

export interface MenuItemProps {
  title: string;
  icon: JSX.Element | false;
  collapsible: DropDown | false;
  disabled: boolean;
  needsWeb3: boolean;
  tabKey?: TabKeys;
}

export const MenuItemComponent: FunctionComponent<MenuItemProps> = ({
  title,
  icon,
  disabled,
  needsWeb3,
  tabKey,
}: MenuItemProps): JSX.Element => {
  const { onTabSelected } = useMenu();
  const { showModal: showConnectModal } = useConnectModal();
  const { account } = useWeb3React<JsonRpcProvider>();

  const onMenuItemTriggered = (): void => {
    if (needsWeb3 && !account) {
      showConnectModal();
    }
    if (tabKey) {
      onTabSelected(tabKey);
    }
  };

  return (
    <li
      className={cx(styles["menu-item"], {
        [styles["disabled"] as string]: disabled,
        [styles["menu-item-active"] as string]: open,
      })}
      onClick={onMenuItemTriggered}
      onKeyPress={onMenuItemTriggered}
      role="menuitem">
      <button
        className={cx(styles["button-menu"], {
          [styles["disabled"] as string]: disabled,
        })}>
        {icon && icon}
        {title}
      </button>
    </li>
  );
};
