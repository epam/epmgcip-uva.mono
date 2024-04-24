import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Dot } from '../Dot';

describe('Testing: Dot', () => {
  it('should render', () => {
    const { container } = render(<Dot />);

    expect(container).toMatchSnapshot();
  });
});
