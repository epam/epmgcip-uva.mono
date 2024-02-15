import { Button } from 'src/components';
import css from './Menu.module.sass';
import CloseSvg from 'src/assets/cross.svg';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setMenu, setUserName } from 'src/redux/actions';
import { Link } from 'src/components';
import { useNavigate } from 'react-router-dom';
import {
  CREATE_EVENT_ROUTE,
  EVENTS_ROUTE,
  MANAGE_USERS_ROUTE,
  ROOT_ROUTE,
  VOLUNTEERS_ROUTE,
} from '../../constants';

const getMenuLinkClasses = (currentRoute: string, chekingRoute: string) =>
  currentRoute === chekingRoute
    ? `${css.menuLink} ${css.currentMenuLink}`
    : css.menuLink;

export const Menu = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate = useNavigate();
  const currentRoute = window.location.pathname;

  const handleCloseMenu = () => {
    dispatch(setMenu(false));
  };
  const handleChangePage = (route: string) => {
    navigate(route);
    handleCloseMenu();
  };
  const handleLogout = () => {
    dispatch(setUserName(''));
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
          className={getMenuLinkClasses(currentRoute, EVENTS_ROUTE)}
        >
          Events
        </Link>
        <Link
          onClick={() => handleChangePage(CREATE_EVENT_ROUTE)}
          className={getMenuLinkClasses(currentRoute, CREATE_EVENT_ROUTE)}
        >
          Create Event
        </Link>
        <Link
          onClick={() => handleChangePage(VOLUNTEERS_ROUTE)}
          className={getMenuLinkClasses(currentRoute, VOLUNTEERS_ROUTE)}
        >
          Volunteers List
        </Link>
        <Link
          onClick={() => handleChangePage(MANAGE_USERS_ROUTE)}
          className={getMenuLinkClasses(currentRoute, MANAGE_USERS_ROUTE)}
        >
          Manage Stuff
        </Link>
        <Link onClick={handleLogout} className={css.menuLink}>
          Logout
        </Link>
      </div>
    </div>
  );
};
