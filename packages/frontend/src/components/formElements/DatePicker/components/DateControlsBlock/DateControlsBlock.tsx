import { MONTHS } from 'src/constants';
import css from './DateControlsBlock.module.sass';
import translation from 'src/translations/Russian.json';
import { Button } from 'src/components';

interface DateControlsBlockProps {
  currentMonth: number;
  navigateMonth: (step: number) => void;
}

export const DateControlsBlock = ({ currentMonth, navigateMonth }: DateControlsBlockProps) => {
  return (
    <div className={css.dateControlsBlock}>
      <Button className={css.dateControlsBlockButton} onClick={() => navigateMonth(-1)}>
        {translation.previous}
      </Button>
      <span className={css.dateControlsMonth}>{MONTHS[currentMonth].name}</span>
      <Button className={css.dateControlsBlockButton} onClick={() => navigateMonth(1)}>
        {translation.next}
      </Button>
    </div>
  );
};
