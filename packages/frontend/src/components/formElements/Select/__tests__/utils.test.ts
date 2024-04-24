import { describe, expect, it } from 'vitest';
import { isValueSelected, setMultipleValue, showCurrentValues } from '../utils';
import { LANGUAGE } from 'src/constants';
import { Language } from 'src/types';

describe('Testing: Select utils', () => {
  it.each`
    previousValue           | newValue | expected
    ${null}                 | ${'3'}   | ${'3'}
    ${['1', '2']}           | ${'3'}   | ${['1', '2', '3']}
    ${['1', '3']}           | ${'2'}   | ${['1', '2', '3']}
    ${['1', '2', '3', '4']} | ${'3'}   | ${['1', '2', '4']}
  `(
    'setMultipleValue should return $expected when previousValue: $previousValue and newValue: $newValue',
    ({ previousValue, newValue, expected }) => {
      const received = setMultipleValue(previousValue, newValue);

      expect(received).toEqual(expected);
    }
  );

  it.each`
    allValues     | value        | expected
    ${undefined}  | ${'1'}       | ${false}
    ${['1', '2']} | ${undefined} | ${false}
    ${'1'}        | ${'1'}       | ${true}
    ${['1', '2']} | ${'2'}       | ${true}
  `(
    'isValueSelected should return $expected when allValues: $allValues and value: $value',
    ({ allValues, value, expected }) => {
      const received = isValueSelected(allValues, value);

      expect(received).toBe(expected);
    }
  );

  it.each`
    currentValue                               | multiple | placeholder           | expected
    ${Language.Russian}                        | ${false} | ${'Test Placeholder'} | ${LANGUAGE[0].name}
    ${''}                                      | ${false} | ${'Test Placeholder'} | ${'Test Placeholder'}
    ${Language.Russian}                        | ${true}  | ${'Test Placeholder'} | ${LANGUAGE[0].name}
    ${[Language.Russian, Language.Qoraqalpoq]} | ${true}  | ${'Test Placeholder'} | ${`${LANGUAGE[0].name}, ${LANGUAGE[3].name}`}
  `(
    'isValueSelected should return $expected when currentValue: $currentValue, placeholder: $placeholder and multiple: $multiple',
    ({ currentValue, multiple, placeholder, expected }) => {
      const received = showCurrentValues(
        LANGUAGE,
        currentValue,
        multiple,
        placeholder
      );

      expect(received).toBe(expected);
    }
  );
});
