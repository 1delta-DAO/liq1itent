import React, { FunctionComponent } from "react";
import cx from "classnames";

import styles from "./Spinner.module.scss";

export interface SpinnerProps {
  autoHeight?: boolean;
  size?: "small" | "large" | "normal";
  type?: "normal";
}

const defaultSpinnerProps: SpinnerProps = {
  autoHeight: false,
  size: "normal",
};

export const SpinnerComponent: FunctionComponent<SpinnerProps> = (
  props: SpinnerProps
) => {
  return (
    <div
      className={cx(
        styles["loader"],
        styles["simple-circle"],
        styles[props.size || "small"]
      )}
    />
  );
};

SpinnerComponent.defaultProps = defaultSpinnerProps;
