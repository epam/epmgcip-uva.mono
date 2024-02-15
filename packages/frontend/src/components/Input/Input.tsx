import css from './Input.module.sass';

interface InputProps {
  value: string;
  setChange: React.Dispatch<React.SetStateAction<string>>;
  labelText: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export const Input = ({
  value,
  setChange,
  labelText,
  required = false,
  minLength,
  maxLength,
  placeholder,
  labelClassName,
  inputClassName,
}: InputProps) => {
  const { label, input } = css;
  const labelClasses = labelClassName ? `${label} ${labelClassName}` : label;
  const inputClasses = inputClassName ? `${input} ${inputClassName}` : input;

  return (
    <label className={labelClasses}>
      <div>
        {labelText}
        {required && <span className={css.inputRequired}> *</span>}
      </div>
      <input
        type='text'
        required={required}
        placeholder={placeholder || 'Ввод'}
        minLength={minLength}
        maxLength={maxLength}
        className={inputClasses}
        value={value}
        onChange={(e) => setChange(e.target.value)}
      />
    </label>
  );
};
