import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Link } from "../Link";

const textMock = 'Test Link';
const childrenMock = <div>{textMock}</div>;
const onClickMock = vi.fn();
const additionalClassMock = 'additionalTestClass';


describe('Testing: Link', () => {
    it('should render', () => {
      const { container } = render(
        <Link
          children={childrenMock}
          onClick={onClickMock}
          className={additionalClassMock}
        />
      );
  
      expect(container).toMatchSnapshot();
    });
  
    it('should call provided function after click', () => {
        render(
            <Link
              children={childrenMock}
              onClick={onClickMock}
              className={additionalClassMock}
            />
          );
  
      const renderedLink = screen.getByText(textMock);
  
      fireEvent.click(renderedLink);
  
      expect(onClickMock).toHaveBeenCalled();
    });
  });