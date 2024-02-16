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
}: SelectProps<T>) => {
  const { label, select } = css;
  const labelClasses = labelClassName ? `${label} ${labelClassName}` : label;
  const selectClasses = selectClassName
    ? `${select} ${selectClassName}`
    : select;

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
        required={required}
      >
        {placeholder && <option disabled={true} value=''>
          {placeholder}
        </option>}
        {options.map(({ name, value }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
};
