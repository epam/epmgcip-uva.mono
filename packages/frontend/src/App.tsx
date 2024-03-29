import { Header, Menu } from './components';
import { Outlet } from 'react-router-dom';
import css from './App.module.sass';
import { useSelector } from 'react-redux';
import { IState } from './types';
import { useEffect } from 'react';
import { hideElement, showElement } from './utils';
import { Notification } from './components';

function App() {
  const userName = useSelector((state: IState) => state.userName);
  const isMenu = useSelector((state: IState) => state.isMenu);
  const menu = document.getElementById('menu');

  useEffect(() => {
    if (menu) {
      isMenu ? showElement(menu) : hideElement(menu)
    }
  }, [isMenu, menu]);

  return (
    <>
      <Header userName={userName} />
      <div className={css.app}>
        <Outlet />
      </div>
      <Menu />
      <Notification />
    </>
  );
}

export default App;
