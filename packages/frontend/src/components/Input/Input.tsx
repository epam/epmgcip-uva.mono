import { getClassesList } from 'src/utils/getClassesList';
import css from './Input.module.sass';
import translation from 'src/translations/Russian.json';

type InputChange = (value: string) => {
  type: string;
  payload: string;
}

interface InputProps {
  value: string;
  setChange: React.Dispatch<React.SetStateAction<string>> | InputChange;
  type?: 'text' | 'number' | 'date' | 'search' | 'time';
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
  type = 'text',
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
  const labelClasses = getClassesList(css.label, labelClassName);

  const inputClasses = getClassesList(
    css.input,
    inputClassName,
    isValidationError ? css.inputError : undefined
  );

  return (
    <label className={labelClasses}>
      {labelText && (
        <div>
          {labelText}
          {required && <span className={css.inputRequired}> *</span>}
        </div>
      )}
      <input
        type={type}
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
