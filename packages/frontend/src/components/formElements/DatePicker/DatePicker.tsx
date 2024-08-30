import { getClassesList } from 'src/utils/getClassesList';
import css from './DatePicker.module.sass';
import translation from 'src/translations/Russian.json';
import { DatePopup } from './components/DatePopup/DatePopup';
import { DateItem } from './components/DateItem/DateItem';
import { getFormatDate, getNormalizeDate, getMonth } from './utils';
import { useEffect, useMemo, useState } from 'react';
import CalendarSvg from './assets/calendar.svg';

interface InputProps {
  value: string;
  setChange: React.Dispatch<React.SetStateAction<string>>;
  labelText?: string;
  min?: string;
  max?: string;
  required?: boolean;
  placeholder?: string;
  labelClassName?: string;
  datePickerClassName?: string;
  isValidationError?: boolean;
  errorMessage?: string;
}

export const DatePicker = ({
  value,
  setChange,
  labelText,
  min,
  max,
  required = false,
  placeholder,
  labelClassName,
  datePickerClassName,
  isValidationError,
  errorMessage,
}: InputProps) => {
  const labelClasses = getClassesList(css.label, labelClassName);
  const datePickerClasses = getClassesList(
    css.datePicker,
    datePickerClassName,
    isValidationError ? css.datePickerError : undefined
  );

  const [showPopup, setShowPopup] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const daysArray = useMemo(() => getMonth(currentMonth, currentYear), [currentMonth, currentYear]);
  const handleShowPopup = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    setShowPopup(previousValue => !previousValue);
  };

  const handleNavigateMonth = (navigateBy: number) => {
    if (currentMonth + navigateBy === 12) {
      setCurrentMonth(0);
      setCurrentYear(currentState => {
        return currentState + 1;
      });
    } else if (currentMonth + navigateBy === -1) {
      setCurrentMonth(11);
      setCurrentYear(currentState => {
        return currentState - 1;
      });
    } else {
      setCurrentMonth(currentState => {
        return currentState + navigateBy;
      });
    }
  };

  const handleSelectDate = (date: string) => {
    const normalizeDate = getNormalizeDate(date);

    setChange(() => normalizeDate);
    setSelectedDate(date);
    setShowPopup(false);
  };

  useEffect(() => {
    if (value) {
      const [day, month, year] = value.split('-');
      const dateObject = new Date(`${month}-${day}-${year}`);

      setSelectedDate(getFormatDate(dateObject));
      setCurrentMonth(dateObject.getMonth());
      setCurrentYear(dateObject.getFullYear());
    }
  }, [value]);

  return (
    <div className={css.datePickerWrapper}>
      <label className={labelClasses}>
        {labelText && (
          <div>
            {labelText}
            {required && <span className={css.datePickerRequired}> *</span>}
          </div>
        )}
        <div className={datePickerClasses} onClick={e => handleShowPopup(e)}>
          {value || placeholder || translation.input}
          <img className={css.pickerCalendar} src={CalendarSvg} />
        </div>
        {isValidationError && (
          <p className={css.validationError}>{isValidationError && errorMessage}</p>
        )}
      </label>
      {showPopup && (
        <DatePopup
          currentMonth={currentMonth}
          currentYear={currentYear}
          navigateMonth={handleNavigateMonth}
          setShowPopup={setShowPopup}
        >
          {daysArray!.map((date, index) => (
            <DateItem
              key={index}
              dateObject={date ? new Date(date) : null}
              onClick={() => (date ? handleSelectDate(date) : null)}
              isSelected={selectedDate === date}
              isDisabled={Boolean(
                (date && min && date < getNormalizeDate(min)) ||
                  (date && max && date > getNormalizeDate(max))
              )}
            />
          ))}
        </DatePopup>
      )}
    </div>
  );
};
