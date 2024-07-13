import React from "react";
import styles from "./swap.module.scss";
import { TradeComponent } from "../../components/trade/trade.component";

export const SwapTab: React.FC = () => {
  return (
    <div className={styles["swap"]}>
      <TradeComponent />
    </div>
  );
};
