import css from './DatePopup.module.sass';
import translation from 'src/translations/Russian.json';
import { DateControlsBlock } from '../DateControlsBlock/DateControlsBlock';
import { ReactElement, useRef } from 'react';
import { useClickOutside } from 'src/hooks/useClickOutside';

interface DatePopupProps {
  children: ReactElement[] | JSX.Element;
  currentYear: number;
  currentMonth: number;
  navigateMonth: (step: number) => void;
  setShowPopup: (value: React.SetStateAction<boolean>) => void
}

export const DatePopup = ({
  children,
  currentMonth,
  currentYear,
  navigateMonth,
  setShowPopup,
}: DatePopupProps) => {
  const datePopupRef = useRef<HTMLDivElement>(null);

  useClickOutside(datePopupRef, () => {
    setShowPopup(false);
  });

  return (
    <div className={css.datePopupWrapper} ref={datePopupRef}>
      <div className={css.datePopupYear}>{currentYear}</div>
      <DateControlsBlock
        currentMonth={currentMonth}
        navigateMonth={navigateMonth}
      />
      <div className={css.datePopupContainer}>
        <span className={css.weekCode}>{translation.shortMonday}</span>
        <span className={css.weekCode}>{translation.shortTuesday}</span>
        <span className={css.weekCode}>{translation.shortWednesday}</span>
        <span className={css.weekCode}>{translation.shortThursday}</span>
        <span className={css.weekCode}>{translation.shortFriday}</span>
        <span className={css.weekCode}>{translation.shortSaturday}</span>
        <span className={css.weekCode}>{translation.shortSunday}</span>
        {children}
      </div>
    </div>
  );
};
