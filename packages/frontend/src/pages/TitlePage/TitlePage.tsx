import css from './TitlePage.module.sass';
import UVC from 'src/assets/uvc-logo.png';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setEditorName } from 'src/redux/actions';

export const TitlePage = () => {
  const dispatch: Dispatch = useDispatch();

  const handleSetUserName = () => {
    dispatch(setEditorName('Monroe Panela'));
  };

  return (
    <>
      <div className={css.titleWrapper}>
        <img className={css.titleLogo} src={UVC} />
      </div>
      <div className={css.telegramWidget} onClick={handleSetUserName}>
        Telegram Widget Button
      </div>
    </>
  );
};
