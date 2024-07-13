import { TabKeys } from "../../data/tabs";
import { MenuItemProps } from "./menu-item/MenuItem.component";

export interface MenuItem extends MenuItemProps {
  index: number;
}

export const mainMenu: MenuItem[] = [
  {
    index: 1,
    title: "Swap",
    icon: false,
    disabled: false,
    needsWeb3: false,
    collapsible: false,
    tabKey: TabKeys.Swap,
  },
];
