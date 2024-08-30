import { Button } from 'src/components';
import css from './DateItem.module.sass';
import { getClassesList } from 'src/utils/getClassesList';

interface DateItemProps {
  dateObject: Date | null;
  onClick: () => void;
  isSelected: boolean;
  isDisabled?: boolean;
}

export const DateItem = ({
  dateObject,
  onClick,
  isSelected,
  isDisabled = false,
}: DateItemProps) => {
  if (!dateObject) {
    return <div className={css.emptyDataItem}></div>;
  }


  const displayDate = dateObject.getDate();
  const dateItemClasses = getClassesList(css.dateItem, isSelected ? css.selected : undefined);

  return (
    <Button onClick={onClick} className={dateItemClasses} disabled={isDisabled}>
      {displayDate}
    </Button>
  );
};
