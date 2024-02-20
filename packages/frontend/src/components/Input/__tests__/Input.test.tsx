import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Input } from '../Input';

const valueMock = 'Test Value';
const labelTextMock = 'Test Label';
const setChangekMock = vi.fn();

describe('Testing: Input', () => {
  it('should render', () => {
    const { container } = render(
      <Input
        value={valueMock}
        setChange={setChangekMock}
        labelText={labelTextMock}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('should call provided function after input text', () => {
    render(
      <Input
        value={valueMock}
        setChange={setChangekMock}
        labelText={labelTextMock}
      />
    );

    const renderedButton = screen.getByDisplayValue(valueMock);
    const expected = 'Expected Text';

    fireEvent.change(renderedButton, { target: { value: expected } });

    expect(setChangekMock).toHaveBeenCalledWith(expected);
  });
});
