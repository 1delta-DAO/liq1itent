import React, { FunctionComponent } from "react";
import { ButtonComponent } from "../../button/Button.component";
import { TabKeys } from "../../../data/tabs";

import styles from "./DropDown.module.scss";
import { useMenu } from "../useMenu";

export interface DropDownItem {
  id: number;
  name: string;
  icon: string;
  tabKey: TabKeys;
}

export interface DropDownProps {
  items: DropDownItem[];
}

export const DropDownComponent: FunctionComponent<DropDownProps> 
  = ({ items }:DropDownProps): JSX.Element => {

  const { onTabSelected } = useMenu();

  return (
    <div className={styles["dropdown"]}>
      {items
        .map((item: DropDownItem) => {
          return (
            <div key={item.id} className={styles["dropdown-item"]}>
              <img alt={item.name} src={item.icon} />
              <ButtonComponent
                onClick={(): void => {
                  onTabSelected(item.tabKey);
                }}
                text={item.name}
              />
            </div>
          );
        })}
    </div>
  );
};