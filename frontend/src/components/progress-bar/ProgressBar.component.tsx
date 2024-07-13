import React, { FunctionComponent, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { formatNumbersWithDotDelimiter } from '../../utils/utils';

import styles from './ProgressBar.module.scss';

interface ProgressBarProps {
  active?: boolean;
  end: number;
  forcedShowValueIndicator?: boolean;
  progressColor: string;
  progressDotColor: string;
  showIndicators?: boolean;
  showIndicatorsAsPercentage?: boolean;
  showValueIcon?: boolean;
  showSmallValueIcon?: boolean;
  start: number;
  value: number;
  valueLabel?: string;
}

export const ProgressBarComponent: FunctionComponent<ProgressBarProps> = (
  props: ProgressBarProps
): JSX.Element => {
  const [deltaValue, setDeltaValue] = useState<number>(0);
  const valueRef = useRef<HTMLSpanElement | null>(null);
  const [valuePosition, setValuePosition] = useState<number>(0);

  useEffect((): void => {
    setDeltaValue(((props.value - props.start) * 100) / (props.end - props.start));
  }, [props.end, props.start, props.value]);

  useLayoutEffect((): void => {
    if (valueRef && valueRef.current) {
      setValuePosition(deltaValue > 0 ? deltaValue - (valueRef.current?.clientWidth * 4) / 100 : 0);
    }
  }, [deltaValue, valueRef]);

  return (
    <div className={styles['progress-bar-wrapper']}>
      <div className={styles['progress-bar']}>
        {props.value === 100 && !props.active && (
          <div
            className={styles['progress']}
            style={{
              backgroundColor: props.progressColor,
              width: `100%`
            }}
          />
        )}
        {props.active && (
          <div
            className={styles['progress']}
            style={{
              backgroundColor: props.progressColor,
              width: `${deltaValue}%`,
            }}
          >
            <span
              className={[
                styles['progres-icon'],
                props.showValueIcon ? styles['icon'] : styles['no-icon'],
                props.showSmallValueIcon ? styles['small-icon'] : '',
              ].join(' ')}
              style={{ backgroundColor: props.progressDotColor || 'transparent' }}
            >
              <span
                style={{
                  backgroundColor: !props.showValueIcon ? props.progressColor : 'transparent',
                }}
              />
            </span>
          </div>
        )}
      </div>
      {props.showIndicators && (
        <div className={styles['progress-indicators']}>
          <span className={styles['value']} ref={valueRef} style={{ left: `${valuePosition}%` }}>
             {formatNumbersWithDotDelimiter(props.value)}
          </span>
          {valuePosition < 88 && (
            <span className={styles['end']}>
             {formatNumbersWithDotDelimiter(props.end)}
          </span>
          )}
        </div>
      )}
      {props.forcedShowValueIndicator && (
        <div className={styles['progress-indicators']}>
          <span
            className={styles['value']}
            ref={valueRef}
            style={{ color: props.progressColor, left: `${valuePosition}%` }}
          >
            {props.valueLabel} {formatNumbersWithDotDelimiter(props.value)}
          </span>
        </div>
      )}
      {props.showIndicatorsAsPercentage && props.active && (
        <div className={styles['progress-indicators-percentage']}>
          <span>
            {props.value}
            <sup>%</sup>
          </span>
        </div>
      )}
    </div>
  );
};
