import { useEffect, useRef, useState } from "react";
import { COUNTRY_CODE } from "./constants/countryCodes";
import { IOption } from "src/types";
import css from './PhoneInput.module.sass';
import { getClassesList } from "src/utils/getClassesList";
import { useClickOutside } from "src/hooks/useClickOutside";
import ArrowSvg from './../Select/assets/arrow.svg';

const positiveIntegerRegex = /^\d+$/;
const validateDigitalValue = (value: string) => positiveIntegerRegex.test(value);

interface PhoneNumberInputProps {
    labelText: string;
    required?: boolean;
    onChange?: (combinedNumber: string) => void;
    placeholder?: string;
    isValidationError?: boolean;
    errorMessage?: string;
  }

export const PhoneInput: React.FC<PhoneNumberInputProps> = ({ labelText, required, onChange, placeholder, isValidationError, errorMessage }) => {
    const [countryCode, setCountryCode] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const currentSelector = useRef<HTMLLabelElement>(null);
  
    useEffect(() => {
      if (onChange) {
        onChange(`${countryCode}${phoneNumber}`);
      }
    }, [countryCode, phoneNumber, onChange]);

    const selectClasses = getClassesList(
      css.select,
      isValidationError ? css.selectError : undefined
    );

    const inputClasses = getClassesList(
      css.input,
      isValidationError ? css.inputError : undefined
    );

    const isValueSelected = <T,>(allValues: T, value: string): boolean =>
      Array.isArray(allValues) ? allValues.includes(value) : allValues === value;

    const showCurrentValues = (
      options: IOption[],
      currentValue: string,
      placeholder: string
    ) => {
      return (
        options.find((option) => option.name === currentValue)?.name || placeholder
      );
    };

    const getOptionClasses = (value: string) =>
      getClassesList(
        css.option,
        isValueSelected(COUNTRY_CODE, value)
            ? css.selectedOption
            : css.activeOption
      );

    const handleSetSelectChange = (
      event: React.MouseEvent<HTMLDivElement, MouseEvent>,
      value: string
    ) => {
      event.stopPropagation();
      setCountryCode(value);
      setIsSelectOpen(!isSelectOpen);
    };

    const handleSetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!validateDigitalValue(e.target.value) && e.target.value !== '') {
        return;
      }

      setPhoneNumber(e.target.value);
    };

    useClickOutside(currentSelector, () => setIsSelectOpen(false))
  
    return (
      <label className={css.label} ref={currentSelector}>
        <div>
          {labelText} {required && <span className={css.inputRequired}>*</span>}
        </div>
        <div className={css.inputContainer}>
          <div>
            <div
              className={selectClasses}
              tabIndex={0}
              onClick={() => setIsSelectOpen(!isSelectOpen)}
            >
              {showCurrentValues(COUNTRY_CODE, countryCode, placeholder!)}
              <img className={css.selectArrow} src={ArrowSvg} />
            </div>
            <div className={css.selectMenuWrapper}>
            {isSelectOpen && (
            <div className={css.selectMenu}>
                {COUNTRY_CODE.map(({ name, value }) => (
                <div
                    key={name + value}
                    onClick={(e) => handleSetSelectChange(e, name)}
                    tabIndex={0}
                    className={getOptionClasses(value)}
                >
                    {name}
                </div>
                ))}
            </div>
            )}
        </div>
          </div>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => handleSetInputChange(e)}
            placeholder="Phone number"
            className={inputClasses}
          />
        </div>
        {isValidationError && (
        <p className={css.validationError}>
          {isValidationError && errorMessage}
        </p>
      )}
      </label>
    );
  };