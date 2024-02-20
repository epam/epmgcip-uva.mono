import {  describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Menu } from '../Menu';
import { Provider } from 'react-redux';

const observableMock = vi.fn();
const dispatchMock = <T,>() => vi.fn() as T;
const getStateMock = vi.fn();
const subscribeMock = vi.fn();
const replaceReducerMock = vi.fn();
const navigateMock = vi.fn();

const storeMock = {
  [Symbol.observable]: observableMock,
  dispatch: dispatchMock,
  getState: () => getStateMock,
  subscribe: () => subscribeMock,
  replaceReducer: () => replaceReducerMock,
};

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');

  return {
    ...actual,
    useDispach: () => ({ dispatch: dispatchMock }),
  };
});

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return {
    ...actual,
    useNavigate: () => ({ navigate: navigateMock }),
  };
});

describe('Testing: Menu', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={storeMock}>
        <Menu />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });
});
