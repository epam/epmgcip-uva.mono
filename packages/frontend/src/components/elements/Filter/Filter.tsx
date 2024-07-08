import { useState } from 'react';
import { IOption } from 'src/types';
import { getClassesList } from 'src/utils/getClassesList';
import css from './Filter.module.sass';
import FilterSvg from './assets/filter.svg';
import { isValueSelected, showCurrentValue } from './utils';

interface FilterProps<T> {
  value: T;
  setChange: (arg: T) => void;
  options: IOption[];
  filterClassName?: string;
}

export const Filter = <T,>({
  value: currentValue,
  setChange,
  options,
  filterClassName,
}: FilterProps<T>) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterClasses = getClassesList(css.filter, filterClassName);
  const getOptionClasses = (value: T) =>
    getClassesList(
      css.option,
      isValueSelected(currentValue, value) ? css.selectedOption : css.activeOption
    );

  const handleSetChange = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, value: T) => {
    event.stopPropagation();
    setChange(value);
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      <div
        className={filterClasses}
        tabIndex={0}
        onClick={() => {
          setIsFilterOpen(!isFilterOpen);
        }}
        aria-label="filter-button"
      >
        {showCurrentValue(options, currentValue)}
        <img className={css.eventsFilterIcon} src={FilterSvg} />
      </div>
      <div className={css.filterMenuWrapper}>
        {isFilterOpen}
        {isFilterOpen && (
          <div className={css.filterMenu}>
            {options.map(({ name, value }) => (
              <div
                key={value}
                onClick={e => handleSetChange(e, value as T)}
                tabIndex={0}
                className={getOptionClasses(value as T)}
              >
                {name}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
