import css from './Input.module.sass';
import translation from 'src/translations/Russian.json';

interface InputProps {
  value: string;
  setChange: React.Dispatch<React.SetStateAction<string>>;
  labelText?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
  labelClassName?: string;
  inputClassName?: string;
  isValidationError?: boolean;
  errorMessage?: string;
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
  isValidationError,
  errorMessage,
}: InputProps) => {
  const labelClasses = labelClassName
    ? `${css.label} ${labelClassName}`
    : css.label;
  const inputClasses = inputClassName
    ? `${css.input} ${inputClassName}`
    : css.input;

  return (
    <label className={labelClasses}>
      {labelText && (
        <div>
          {labelText}
          {required && <span className={css.inputRequired}> *</span>}
        </div>
      )}
      <input
        type='text'
        required={required}
        placeholder={placeholder || translation.input}
        minLength={minLength}
        maxLength={maxLength}
        className={inputClasses}
        value={value}
        onChange={(e) => setChange(e.target.value)}
      />
      {isValidationError && (
        <p className={css.validationError}>
          {isValidationError && errorMessage}
        </p>
      )}
    </label>
  );
};
