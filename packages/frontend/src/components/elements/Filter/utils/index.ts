import { IOption } from "src/types";

export const isValueSelected = <T>(allValues: T, value: T): boolean =>
  Array.isArray(allValues) ? allValues.includes(value) : allValues === value;

export const showCurrentValue = <T>(
  options: IOption[],
  currentValue: T
) => options.find((option) => option.value === currentValue)?.name;