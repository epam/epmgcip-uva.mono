import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Select } from '../Select';

const valueMock = 'Test Value';
const setChangeMock = vi.fn();
const optionMock = [
  {
    name: 'Name 1',
    value: 'value_1',
  },
  {
    name: 'Name 2',
    value: 'value_2',
  },
];
const labelTextMock = 'Test Label';

describe('Testing: Select', () => {
  it('should render', () => {
    const { container } = render(
      <Select
        value={valueMock}
        setChange={setChangeMock}
        options={optionMock}
        labelText={labelTextMock}
      />
    );

    expect(container).toMatchSnapshot();
  });
});
