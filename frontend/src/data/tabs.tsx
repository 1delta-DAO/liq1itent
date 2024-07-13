import React from "react";

import USDT from "../../public/assets/images/svg/tokens/usdt.svg";
import { SwapTab } from "../tabs/swap/swap.tab";

export enum TabKeys {
  Swap = 1,
}

export interface Tab {
  index: number;
  key: TabKeys;
  title: string;
  icon: string | undefined;
  component: React.ReactElement;
}

export const tabs: Tab[] = [
  {
    index: 1,
    key: TabKeys.Swap,
    title: "Swap",
    icon: USDT,
    component: <SwapTab />,
  },
];
