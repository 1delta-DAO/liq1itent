import React, { FunctionComponent, useEffect, useRef } from "react";
import { useMenu } from "../useMenu";
import styles from "./Hamburger.module.scss";

export const HamburgerComponent: FunctionComponent = (): JSX.Element => {
  const { isHamburgerOpen, onHamburgerToggled } = useMenu();
  const hamburgerRef = useRef<HTMLDivElement | null>(null);

  useEffect((): void => {
    if (isHamburgerOpen) {
      document.body.classList.add(styles["fixed"] as string);
    } else {
      document.body.classList.remove(styles["fixed"] as string);
    }
  }, [isHamburgerOpen]);

  return (
    <div className={[
        styles["hamburger"],
        isHamburgerOpen ? styles["animate"] : "",
      ].join(" ")}
      ref={hamburgerRef}
      onClick={onHamburgerToggled}
      onKeyPress={onHamburgerToggled}
      role="button"
      tabIndex={0}>
      <div className={styles["bar"]}></div>
      <div className={styles["bar"]}></div>
      <div className={styles["bar"]}></div>
    </div>
  );
};
