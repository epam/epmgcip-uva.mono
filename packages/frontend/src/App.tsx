import { Header, Menu, Notification } from './components';
import { Outlet } from 'react-router-dom';
import css from './App.module.sass';
import { useSelector } from 'react-redux';
import { IState } from './types';
import { useEffect } from 'react';
import { showElement } from './utils/showElement';
import { hideElement } from './utils/hideElement';

function App() {
  const editorName = useSelector((state: IState) => state.editor.name);
  const isMenu = useSelector((state: IState) => state.isMenu);
  const menu = document.getElementById('menu');

  useEffect(() => {
    if (menu) {
      isMenu ? showElement(menu) : hideElement(menu);
    }
  }, [isMenu, menu]);

  return (
    <>
      <Header editorName={editorName} />
      <div className={css.app}>
        <Outlet />
      </div>
      <Menu />
      <Notification />
    </>
  );
}

export default App;
