import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ImageLoader } from '../ImageLoader';

const setImageMock = () => vi.fn();

describe('Testing: ImageLoader', () => {
  it('should render', () => {
    const { container } = render(<ImageLoader setImage={setImageMock} />);

    expect(container).toMatchSnapshot();
  });
});
