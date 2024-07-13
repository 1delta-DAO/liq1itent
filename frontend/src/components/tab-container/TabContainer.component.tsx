import React from "react";

interface TabContainerProps {
  tabs: Tab[];
  selectedTab: TabKeys;
}

import styles from "./TabContainer.module.scss";
import { Tab, TabKeys } from "../../data/tabs";

export const TabContainer: React.FC<TabContainerProps> = (
  props: TabContainerProps
) => {
  const tab = props.tabs.find((tab) => props.selectedTab === tab.key);
  if (tab) {
    return <div className={styles["tab"]}>{tab.component}</div>;
  }
  return null;
};
