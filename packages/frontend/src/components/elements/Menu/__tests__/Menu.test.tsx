import {  describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Menu } from '../Menu';
import { Provider } from 'react-redux';
import { ADMIN_ACTIVE_MOCK } from 'src/mocks';
import { configureStore } from '@reduxjs/toolkit';
import { SET_EDITOR } from 'src/redux/types';
import { IAction, IUser } from 'src/types';

const navigateMock = vi.fn();

const stateMock = {
  editor: {} as IUser,
  usersList: [] as IUser[],
  isMenu: false,
  loading: false,
  error: null,
};

const reducerMock = (( state = stateMock, action: IAction) => {
  if (action.type === SET_EDITOR) {
    return {
      ...state,
      editor: action.payload,
    };
  }

  return state;
})

const storeMock = configureStore({ reducer: reducerMock });

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
    storeMock.dispatch({ type: SET_EDITOR, payload: ADMIN_ACTIVE_MOCK });

    expect(container).toMatchSnapshot();
  });
});