import React from "react";
import styles from "./ActionButton.module.scss";
import { ButtonComponent } from "../../Button.component";

interface ActionButtonProps {
  text: string;
  disabled?: boolean;
  action: () => void;
}

export const ActionButtonComponent: React.FC<ActionButtonProps> = ({
  text,
  disabled,
  action,
}) => {
  const onClickAction = (): void => {
    action();
  };

  const renderButton = (): React.ReactNode => {
    if (disabled) {
      return (
        <ButtonComponent
          className={styles["action-button-disabled"]}
          text={text}
        />
      );
    } else {
      return (
        <ButtonComponent
          className={styles["action-button"]}
          onClick={onClickAction}
          text={text}
        />
      );
    }
  };

  return (
    <div className={styles["action-button-container"]}>{renderButton()}</div>
  );
};
