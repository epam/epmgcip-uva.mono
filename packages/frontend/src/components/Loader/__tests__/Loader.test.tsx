import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Loader } from '../Loader';

describe('Testing: Loader', () => {
  it('should render', () => {
    const { container } = render(<Loader />);

    expect(container).toMatchSnapshot();
  });
});
