import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '../Button';

const textMock = 'Test Button';
const childrenMock = <div>{textMock}</div>;
const onClickMock = vi.fn();
const additionalClassMock = 'additionalTestClass';

describe('Testing: Button', () => {
  it('should render', () => {
    const { container } = render(
      <Button children={childrenMock} onClick={onClickMock} className={additionalClassMock} />
    );

    expect(container).toMatchSnapshot();
  });

  it('should call provided function after click', () => {
    render(
      <Button children={childrenMock} onClick={onClickMock} />
    );

    const renderedButton = screen.getByText(textMock);

    fireEvent.click(renderedButton);

    expect(onClickMock).toHaveBeenCalled();
  });
});
