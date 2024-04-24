import { IOption } from "src/types";

export const setMultipleValue = <T,>(previousValue: T, newValue: T): T => {
    if (!Array.isArray(previousValue)) return newValue;
  
    if (previousValue.includes(newValue)) {
      return previousValue.filter((element) => element !== newValue) as T;
    }
  
    return [...(previousValue as T[]), newValue].sort() as T;
  };
  
  export const isValueSelected = <T,>(allValues: T, value: T): boolean =>
    Array.isArray(allValues) ? allValues.includes(value) : allValues === value;
  
  export const showCurrentValues = <T,>(
    options: IOption[],
    currentValue: T,
    multiple: boolean,
    placeholder: string
  ) => {
    if (multiple && Array.isArray(currentValue)) {
      const values = [] as T[];
  
      options.forEach((option) => {
        if (currentValue.includes(option.value)) {
          return values.push(option.name as T);
        }
      });
  
      return values.length === 0 ? placeholder : values.join(', ');
    }
  
    return (
      options.find((option) => option.value === currentValue)?.name || placeholder
    );
  };