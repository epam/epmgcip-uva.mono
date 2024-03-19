import css from './Header.module.sass';
import LogoSvg from 'src/assets/logo.svg';
import MenuSvg from 'src/assets/menu.svg';
import { Button } from 'src/components';
import { setMenu } from 'src/redux/actions';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import translation from 'src/translations/Russian.json';
import { ROOT_ROUTE } from 'src/constants';

interface HeaderProps {
  editorName?: string;
}

const maxNameLength = 25;

export const Header = ({ editorName }: HeaderProps) => {
  const dispatch: Dispatch = useDispatch();
  const currentRoute = window.location.pathname;
  const isMenuEnabled = currentRoute !== ROOT_ROUTE;
  const isLongName = editorName && editorName.length > maxNameLength;

  const handleShowMenu = () => {
    if (isMenuEnabled) {
      dispatch(setMenu(true));
    }
  };

  return (
    <div className={css.headerWrapper}>
      <img className={css.headerLogo} src={LogoSvg} />
      <div className={css.editorName}>
        {isLongName
          ? `${editorName?.slice(0, maxNameLength)}...`
          : editorName || translation.login}
      </div>
      <Button
        onClick={handleShowMenu}
        className={css.headerMenuButton}
        disabled={!isMenuEnabled}
      >
        <img className={css.headerLogo} src={MenuSvg} alt='Open Menu Button' />
      </Button>
    </div>
  );
};
