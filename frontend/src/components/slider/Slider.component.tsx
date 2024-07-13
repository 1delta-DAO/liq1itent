import React from "react";
import ReactSlider from "react-slider";

interface SliderProps {
  onChange?: (value: number) => void;
  max?: number;
  disabled?: boolean;
  currentValue: number;
}

import styles from "./Slider.module.scss";

const Slider: React.FC<SliderProps> = ({
  currentValue,
  max,
  disabled = false,
  onChange,
}): JSX.Element => {
  return (
    <ReactSlider
      className={styles["customSlider"]}
      disabled={disabled}
      trackClassName={styles["customSlider-track"]}
      thumbClassName={styles["customSlider-thumb"]}
      value={currentValue}
      max={max}
      onChange={onChange}
      step={0.1}
    />
  );
};

export default Slider;
