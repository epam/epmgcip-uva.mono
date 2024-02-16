import css from './Header.module.sass';
import LogoSvg from 'src/assets/logo.svg';
import MenuSvg from 'src/assets/menu.svg';
import { Button } from 'src/components';
import { setMenu } from 'src/redux/actions';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import translation from 'src/translations/Russian.json';

interface HeaderProps {
  userName: string;
}

export const Header = ({ userName }: HeaderProps) => {
  const dispatch: Dispatch = useDispatch();

  const handleShowMenu = () => {
    dispatch(setMenu(true));
  };

  return (
    <div className={css.headerWrapper}>
      <img className={css.headerLogo} src={LogoSvg} />
      <div className={css.userName}>{userName || translation.login}</div>
      <Button onClick={handleShowMenu}>
        <img className={css.headerLogo} src={MenuSvg} />
      </Button>
    </div>
  );
};
