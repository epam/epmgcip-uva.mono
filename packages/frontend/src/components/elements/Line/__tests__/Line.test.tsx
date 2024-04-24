import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Line } from '../Line';

describe('Testing: Line', () => {
  it('should render', () => {
    const { container } = render(<Line />);

    expect(container).toMatchSnapshot();
  });
});
