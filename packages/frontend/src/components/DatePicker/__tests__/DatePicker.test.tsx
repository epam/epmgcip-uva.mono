import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { DatePicker } from '../DatePicker';

const valueMock = '';
const setChangeMock = vi.fn();

describe('Testing: DatePicker', () => {
  it('should render', () => {
    const { container } = render(<DatePicker value={valueMock} setChange={setChangeMock} />);

    expect(container).toMatchSnapshot();
  });
});
