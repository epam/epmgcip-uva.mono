import { getClassesList } from 'src/utils/getClassesList';
import css from './Slider.module.sass';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

interface InputProps {
  min: number;
  max: number;
  minValue: number;
  setMinValue: React.Dispatch<React.SetStateAction<number>>;
  maxValue: number;
  setMaxValue: React.Dispatch<React.SetStateAction<number>>;
  labelText?: string;
  required?: boolean;
  labelClassName?: string;
  isValidationError?: boolean;
  errorMessage?: string;
}

const getPercentageValue = (
  value: number,
  minValue: number,
  maxValue: number
) => Math.round(((value - minValue) / (maxValue - minValue)) * 100);

export const Slider = ({
  min,
  max,
  minValue,
  setMinValue,
  maxValue,
  setMaxValue,
  labelText,
  required = false,
  labelClassName,
  isValidationError,
  errorMessage,
}: InputProps) => {
  const labelClasses = getClassesList(css.label, labelClassName);
  const [isMinThumbMove, setIsMinThumbMove] = useState(false);
  const minValueInputRef = useRef<HTMLInputElement>(null);
  const maxValueInputRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);
  const averageValue = Math.round((maxValue + minValue) / 2);

  const getPercentageValueCallback = useCallback(
    (value: number) => getPercentageValue(value, min, max),
    [min, max]
  );

  const handleChangeMinValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) > averageValue) {
      const value = Math.max(Number(event.target.value), minValue + 1);
      setMaxValue(value);
      event.target.value = value.toString();
      setIsMinThumbMove(() => false);
      return;
    }

    const value = Math.min(Number(event.target.value), maxValue - 1);
    setMinValue(value);
    event.target.value = value.toString();
  };

  const handleChangeMaxValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (Number(event.target.value) < averageValue) {
      const value = Math.min(Number(event.target.value), maxValue - 1);
      setMinValue(value);
      event.target.value = value.toString();
      setIsMinThumbMove(() => true);
      return;
    }

    const value = Math.max(Number(event.target.value), minValue + 1);
    setMaxValue(value);
    event.target.value = value.toString();
  };

  useEffect(() => {
    if (minValueInputRef.current) {
      const minPercent = getPercentageValueCallback(
        Number(minValueInputRef.current.value)
      );
      const maxPercent = getPercentageValueCallback(maxValue);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }

    if (maxValueInputRef.current) {
      const minPercent = getPercentageValueCallback(minValue);
      const maxPercent = getPercentageValueCallback(
        Number(maxValueInputRef.current.value)
      );

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minValue, maxValue, getPercentageValueCallback]);

  return (
    <label className={labelClasses}>
      {labelText && (
        <div>
          {labelText}
          {required && <span className={css.inputRequired}> *</span>}
        </div>
      )}
      <div className={css.sliderContainer}>
        <input
          type='range'
          min={min}
          max={max}
          value={minValue}
          ref={minValueInputRef}
          onChange={handleChangeMinValue}
          className={css.thumb}
          style={{ pointerEvents: isMinThumbMove ? 'all' : 'none' }}
        />
        <input
          type='range'
          min={min}
          max={max}
          value={maxValue}
          ref={maxValueInputRef}
          onChange={handleChangeMaxValue}
          className={css.thumb}
          style={{ pointerEvents: isMinThumbMove ? 'none' : 'all' }}
        />
        <div className={css.slider}>
          <div className={css.sliderTrack}></div>
          <div ref={range} className={css.sliderRange}></div>
          <div className={css.sliderLeftValue}>{minValue}</div>
          <div className={css.sliderRightValue}>
            {maxValue > 60 ? '60+' : maxValue}
          </div>
        </div>
      </div>
      {isValidationError && (
        <p className={css.validationError}>
          {isValidationError && errorMessage}
        </p>
      )}
    </label>
  );
};
