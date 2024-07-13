import React from 'react';
import cx from 'classnames';

import styles from './toggle-switch.module.scss';

interface ToggleSwitchProps {
  className?: string;
  checked: boolean;
  loading?: boolean;
  onChange: (checked: boolean) => void;
  icons?: {
    checked?: string;
    unchecked?: string;
  };
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = (props: ToggleSwitchProps) => {
  const onCheckboxChange = (event: React.SyntheticEvent): void => {
    event.stopPropagation();
    props.onChange(!props.checked);
  };

  const renderIcon = (): React.ReactNode => {
    const icon = props.checked ? props.icons?.checked : props.icons?.unchecked;
    if (icon && !props.loading) {
      return (
        <img className={styles['icon']} alt={props.checked ? 'Checked' : 'Unchecked'} src={icon} />
      );
    }
    return null;
  };

  return (
    <div
      className={cx(styles['switch'], props.className)}
      role="checkbox"
      aria-checked
      onKeyPress={onCheckboxChange}
      onClick={onCheckboxChange}
      tabIndex={-2}
    >
      <input type="checkbox" checked={props.checked} onChange={onCheckboxChange} />
      <span className={cx(styles['slider'], { [styles['loading']!]: props.loading })}>
        {renderIcon()}
      </span>
    </div>
  );
};
