import React, {
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import carret from "../../../public/assets/images/svg/carret.svg";

import styles from "./Select.module.scss";

export interface SelectOption {
  key?: number;
  label?: string;
  value: string;
  icon?: string;
}

interface SelectProps {
  options: SelectOption[];
  placeholder?: string;
  onOptionChange: (index: number) => void;
  selectedValue?: number;
  renderOption?: (option: SelectOption, index: number) => ReactNode;
  renderValue?: (
    value: SelectOption,
    index: number,
    onClick: (event?: MouseEvent<HTMLElement>) => void
  ) => ReactNode;
}

export const SelectComponent: React.FC<SelectProps> = ({
  options,
  selectedValue,
  placeholder,
  renderOption,
  onOptionChange,
  renderValue,
}: SelectProps) => {
  const controlRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const onOptionClick = useCallback(
    (selectedOption: SelectOption) =>
      (event: MouseEvent | KeyboardEvent): void => {
        event.preventDefault();
        event.stopPropagation();
        const optionIndex = options.findIndex(
          (option) => option.key === selectedOption.key
        );
        setIsOpen(false);
        onOptionChange(optionIndex);
      },

    [options, onOptionChange]
  );

  const onDocumentClick = useCallback(
    (event: Event) => {
      if (
        controlRef.current &&
        event.target &&
        event.target instanceof Element &&
        !controlRef.current.contains(event.target) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    },
    [controlRef, setIsOpen, isOpen]
  );

  useEffect(() => {
    document.addEventListener("click", onDocumentClick);
    return (): void => {
      document.removeEventListener("click", onDocumentClick);
    };
  }, [onDocumentClick]);

  const onSelect = (): void => {
    setIsOpen(!isOpen);
  };

  const renderValueEl = (): ReactNode => {
    if (selectedValue !== undefined && options[selectedValue]) {
      if (renderValue) {
        return renderValue(options[selectedValue]!, selectedValue, onSelect);
      }

      return (
        <div
          className={styles["select-value"]}
          tabIndex={-1}
          role="button"
          onKeyDown={onSelect}
          onClick={onSelect}>
          {options[selectedValue]?.icon && (
            <img
              className={styles["select-value-icon"]}
              src={options[selectedValue]?.icon}
              alt={options[selectedValue]?.value}
            />
          )}
          <div>
            {options[selectedValue]?.label ||
              options[selectedValue]?.value ||
              placeholder}
          </div>
          <img alt="trigger" className={styles["carret"]} src={carret} />
        </div>
      );
    }
    if (placeholder) {
      return (
        <div
          className={styles["select-value"]}
          tabIndex={-1}
          role="button"
          onKeyDown={onSelect}
          onClick={onSelect}>
          <div>{placeholder}</div>
          <img alt="trigger" className={styles["carret"]} src={carret} />
        </div>
      );
    }
    return null;
  };

  const renderOptionEl = (option: SelectOption, index: number): ReactNode => {
    let el: ReactNode = (
      <>
        {option.icon && (
          <img
            className={styles["select-option-icon"]}
            src={option.icon}
            alt={option.label || option.value}
          />
        )}
        <span className={styles["select-option-label"]}>
          {option.label || option.value}
        </span>
      </>
    );

    if (renderOption) {
      el = renderOption(option, index);
    }

    return (
      <div
        className={styles["select-option"]}
        key={`select-option-${option.value}-${index}`}
        onClick={onOptionClick(option)}
        onKeyDown={onOptionClick(option)}
        role="button"
        tabIndex={0}>
        {el}
      </div>
    );
  };

  return (
    <div
      className={[styles["select-wrapper"], isOpen ? styles["open"] : ""].join(
        " "
      )}
      onKeyDown={onSelect}
      ref={controlRef}
      role="menuitem"
      tabIndex={0}>
      <div className={styles["select-value-container"]}>{renderValueEl()}</div>
      {isOpen && (
        <div className={styles["select-options"]}>
          {options.map(renderOptionEl)}
        </div>
      )}
    </div>
  );
};
