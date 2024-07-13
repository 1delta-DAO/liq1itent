import React, { FunctionComponent, ReactNode } from 'react';
import cx from 'classnames';

import { SpinnerComponent } from '../spinner/Spinner.component';

import styles from './Button.module.scss';

interface ButtonProps {
  color?: 'standard' | 'green';
  className?: string;
  icon?: string;
  isHoverAnimation?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  text?: string;
  disabled?: boolean;
  children?: ReactNode | undefined;
}

export const ButtonComponent: FunctionComponent<ButtonProps> = (
  props: ButtonProps
): JSX.Element => {
  const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    if (!props.disabled) {
      props.onClick?.(e);
    }
  };

  return (
    <button
      className={cx(styles['button'], styles[props.color || 'standard'], props.className, {
        [styles['disabled'] as string]: props.disabled,
      })}
      onClick={onButtonClick}
    >
      {!props.loading && (
        <>
          {props.icon && <img alt="button" src={props.icon} />}
          {props.text}
        </>
      )}
      {props.loading && <SpinnerComponent />}
      {!props.loading && props.children}
    </button>
  );
};
