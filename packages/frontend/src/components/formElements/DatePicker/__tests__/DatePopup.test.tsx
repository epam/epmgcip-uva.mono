import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { DatePopup } from '../components/DatePopup/DatePopup';

const textMock = 'Days Items';
const childrenMock = <div>{textMock}</div>;
const currentYearMock = 2020;
const currentMonthMock = 10;
const navigateMonthMock = vi.fn();
const setShowPopupMock = vi.fn();

describe('Testing: DatePopup', () => {
  it('should render', () => {
    const { container } = render(
      <DatePopup
        children={childrenMock}
        currentYear={currentYearMock}
        currentMonth={currentMonthMock}
        navigateMonth={navigateMonthMock}
        setShowPopup={setShowPopupMock}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
