import { getClassesList } from 'src/utils/getClassesList';
import css from './Select.module.sass';
import { useRef, useState } from 'react';
import ArrowSvg from './assets/arrow.svg';
import { IOption } from 'src/types';
import { isValueSelected, setMultipleValue, showCurrentValues } from './utils';
import { useClickOutside } from 'src/hooks/useClickOutside';

interface SelectProps<T> {
  value: T;
  setChange: React.Dispatch<React.SetStateAction<T>>;
  options: IOption[];
  labelText: string;
  multiple?: boolean;
  required?: boolean;
  placeholder?: string;
  labelClassName?: string;
  selectClassName?: string;
  isValidationError?: boolean;
  errorMessage?: string;
}

export const Select = <T,>({
  value: currentValue,
  setChange,
  options,
  labelText,
  multiple = false,
  required = false,
  placeholder = '',
  labelClassName,
  selectClassName,
  isValidationError,
  errorMessage,
}: SelectProps<T>) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const currentSelector = useRef<HTMLLabelElement>(null);
  const labelClasses = getClassesList(css.label, labelClassName);
  const selectClasses = getClassesList(
    css.select,
    selectClassName,
    isValidationError ? css.selectError : undefined
  );
  const arrowClasses = getClassesList(
    css.selectArrow,
    isSelectOpen ? css.selectMenuOpen : undefined
  );
  const getOptionClasses = (value: T) =>
    getClassesList(
      css.option,
      isValueSelected(currentValue, value)
        ? css.selectedOption
        : css.activeOption
    );

  const handleSetChange = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    value: T
  ) => {
    event.stopPropagation();
    multiple
      ? setChange((previousValue) => setMultipleValue(previousValue, value))
      : setChange(value);
    !multiple && setIsSelectOpen(!isSelectOpen);
  };

  useClickOutside(currentSelector, () => setIsSelectOpen(false))

  return (
    <label className={labelClasses} ref={currentSelector}>
      <div>
        {labelText}
        {required && <span className={css.selectRequired}> *</span>}
      </div>
      <div
        className={selectClasses}
        tabIndex={0}
        onClick={() => setIsSelectOpen(!isSelectOpen)}
      >
        {showCurrentValues(options, currentValue, multiple, placeholder)}
        <img className={arrowClasses} src={ArrowSvg} />
      </div>
      <div className={css.selectMenuWrapper}>
        {isSelectOpen && (
          <div className={css.selectMenu}>
            {options.map(({ name, value }) => (
              <div
                key={value}
                onClick={(e) => handleSetChange(e, value as T)}
                tabIndex={0}
                className={getOptionClasses(value as T)}
              >
                {name}
              </div>
            ))}
          </div>
        )}
      </div>
      {isValidationError && (
        <p className={css.validationError}>
          {isValidationError && errorMessage}
        </p>
      )}
    </label>
  );
};
