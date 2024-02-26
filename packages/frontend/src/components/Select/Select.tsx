import { getClassesList } from 'src/utils';
import css from './Select.module.sass';

interface IOption {
  name: string;
  value: string;
}

interface SelectProps<T> {
  value: string;
  setChange: React.Dispatch<React.SetStateAction<T>>;
  options: IOption[];
  labelText: string;
  required?: boolean;
  placeholder?: string;
  labelClassName?: string;
  selectClassName?: string;
  isValidationError?: boolean;
  errorMessage?: string;
}

export const Select = <T,>({
  value,
  setChange,
  options,
  labelText,
  required = false,
  placeholder,
  labelClassName,
  selectClassName,
  isValidationError,
  errorMessage,
}: SelectProps<T>) => {
  const labelClasses = getClassesList(css.label, labelClassName);
  const selectClasses = getClassesList(
    css.select,
    selectClassName,
    isValidationError ? css.selectError : undefined
  );

  return (
    <label className={labelClasses}>
      <div>
        {labelText}
        {required && <span className={css.selectRequired}> *</span>}
      </div>
      <select
        value={value}
        onChange={(e) => setChange(e.target.value as T)}
        className={selectClasses}
      >
        {placeholder && (
          <option disabled={true} value=''>
            {placeholder}
          </option>
        )}
        {options.map(({ name, value }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>
      {isValidationError && (
        <p className={css.validationError}>
          {isValidationError && errorMessage}
        </p>
      )}
    </label>
  );
};
