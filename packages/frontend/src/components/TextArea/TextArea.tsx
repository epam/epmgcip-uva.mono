import { getClassesList } from 'src/utils/getClassesList';
import css from './TextArea.module.sass';
import translation from 'src/translations/Russian.json';

interface TextAreaProps {
  value: string;
  setChange: React.Dispatch<React.SetStateAction<string>>;
  labelText?: string;
  required?: boolean;
  placeholder?: string;
  labelClassName?: string;
  textAreaClassName?: string;
  isValidationError?: boolean;
  errorMessage?: string;
}

export const TextArea = ({
  value,
  setChange,
  labelText,
  required = false,
  placeholder,
  labelClassName,
  textAreaClassName,
  isValidationError,
  errorMessage,
}: TextAreaProps) => {
  const labelClasses = getClassesList(css.label, labelClassName);

  const textAreaClasses = getClassesList(
    css.textArea,
    textAreaClassName,
    isValidationError ? css.inputError : undefined
  );

  const handleSetChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChange(e.target.value);
  };

  return (
    <label className={labelClasses}>
      {labelText && (
        <div>
          {labelText}
          {required && <span className={css.inputRequired}> *</span>}
        </div>
      )}
      <textarea
        placeholder={placeholder || translation.input}
        className={textAreaClasses}
        value={value}
        onChange={(e) => handleSetChange(e)}
      />
      {isValidationError && (
        <p className={css.validationError}>
          {isValidationError && errorMessage}
        </p>
      )}
    </label>
  );
};
