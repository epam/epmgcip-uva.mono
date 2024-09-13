import { ChangeEvent } from 'react';
import { IOption } from 'src/types';
import css from './RadioButton.module.sass';

interface IDescriptions {
  name: string;
  value: string;
}

interface RadioButtonProps<T> {
  options: IOption[];
  descriptions: IDescriptions[];
  value: T;
  setChange: (value: T) => void;
  label: string;
  required?: boolean;
}

export function RadioButton<T extends string | number>({
  options,
  descriptions,
  value,
  setChange,
  label,
  required = false,
}: RadioButtonProps<T>) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChange(e.target.value as T);
  };

  return (
    <div className={css['radio-button-container']}>
      <div className={css['radio-button-label']}>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </div>
      {options.map((option) => {
        const description = descriptions.find(desc => desc.value === option.value);
        const isSelected = value === option.value;

        return (
          <div
            key={option.value.toString()}
            className={`${css['radio-button-item']} ${isSelected ? css['selected'] : ''}`}
          >
            <label style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <input
                type="radio"
                id={option.value.toString()}
                value={option.value}
                checked={value === option.value}
                onChange={handleChange}
                className={css['radio-button-input']}
              />
              <div>
                <div>{option.name}</div>
                {description && (
                  <div className={css['radio-button-description']}>
                    {description.name}
                  </div>
                )}
              </div>
            </label>
          </div>
        );
      })}
    </div>
  );
}
