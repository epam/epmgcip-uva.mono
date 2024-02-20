import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Header } from '../Header';
import { Provider } from 'react-redux';
import * as Actions from 'src/redux/actions';


const editorNameMock = 'Test User Name';
const observableMock = vi.fn();
const dispatchMock = <T,>() => vi.fn() as T;
const getStateMock = vi.fn();
const subscribeMock = vi.fn();
const replaceReducerMock = vi.fn();

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

describe('Testing: Header', () => {
  it('should render', () => {
    const { container } = render(
      <Provider store={storeMock}>
        <Header editorName={editorNameMock} />
      </Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it('should call dispatch after click', () => {
    const spyOnSetMenu = vi.spyOn(Actions, 'setMenu')

    render(
      <Provider store={storeMock}>
        <Header editorName={editorNameMock} />
      </Provider>
    );

    const renderedButton = screen.getByAltText('Open Menu Button');

    fireEvent.click(renderedButton);

    expect(spyOnSetMenu).toHaveBeenCalled();
  });
});
