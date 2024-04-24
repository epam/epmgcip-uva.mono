import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Notification } from '../Notification';

describe('Testing: Notification', () => {
  it('should render', () => {
    const { container } = render(<Notification />);

    expect(container).toMatchSnapshot();
  });
});
