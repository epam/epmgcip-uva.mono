import { Button, Modal } from 'src/components';
import css from './Menu.module.sass';
import CloseSvg from 'src/assets/cross.svg';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setMenu, setEditor } from 'src/redux/actions';
import { Link } from 'src/components';
import { useNavigate } from 'react-router-dom';
import {
  CREATE_EVENT_ROUTE,
  EVENTS_ROUTE,
  LOGOUT_USER_QUESTION,
  MANAGE_USERS_ROUTE,
  ROOT_ROUTE,
  VOLUNTEERS_ROUTE,
} from 'src/constants';
import { IState, IUser, UserRole } from 'src/types';
import { checkUserAuthorization, getClassesList } from 'src/utils';
import translation from 'src/translations/Russian.json';
import { useState } from 'react';

const getMenuLinkClasses = (condition: boolean) =>
  getClassesList(css.menuLink, condition ? css.currentMenuLink : undefined);

export const Menu = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate = useNavigate();
  const currentRoute = window.location.pathname;
  const editor = useSelector((state: IState) => state.editor);
  const [isLogout, setIsLogout] = useState(false);

  const switchLogoutModal = () => setIsLogout(() => !isLogout)

  const handleCloseMenu = () => {
    dispatch(setMenu(false));
  };
  const handleChangePage = (route: string) => {
    navigate(route);
    handleCloseMenu();
  };
  const handleLogout = () => {
    switchLogoutModal();
    dispatch(setEditor({} as IUser));
    handleChangePage(ROOT_ROUTE);
  };

  return (
    <div id='menu' className={css.menuWrapper}>
      <div className={css.menuContent}>
        <Button onClick={handleCloseMenu}>
          <img className={css.menuCloseButton} src={CloseSvg} />
        </Button>
        <Link
          onClick={() => handleChangePage(EVENTS_ROUTE)}
          className={getMenuLinkClasses(currentRoute === EVENTS_ROUTE)}
        >
          {translation.events}
        </Link>
        <Link
          onClick={() => handleChangePage(CREATE_EVENT_ROUTE)}
          className={getMenuLinkClasses(currentRoute === CREATE_EVENT_ROUTE)}
        >
          {translation.createEvent}
        </Link>
        <Link
          onClick={() => handleChangePage(VOLUNTEERS_ROUTE)}
          className={getMenuLinkClasses(currentRoute === VOLUNTEERS_ROUTE)}
        >
          {translation.volunteersList}
        </Link>
        {checkUserAuthorization(editor) === UserRole.Admin && (
          <Link
            onClick={() => handleChangePage(MANAGE_USERS_ROUTE)}
            className={getMenuLinkClasses(currentRoute === MANAGE_USERS_ROUTE)}
          >
          {translation.usersList}
          </Link>
        )}
        <Link onClick={switchLogoutModal} className={css.menuLink}>
          {translation.logout}
        </Link>
        {isLogout && (
          <Modal
            cancelButtonMessage={translation.back}
            submitButtonMessage={translation.logout}
            isLoading={false}
            handleClose={switchLogoutModal}
            handleSubmit={handleLogout}
            message={LOGOUT_USER_QUESTION}
            submitClassName={css.modalUserLogoutButton}
            cancelClassName={css.modalCancelButton}
          />
        )}
      </div>
    </div>
  );
};
