import css from './TitlePage.module.sass';
import UVC from 'src/assets/uvc-logo.png';
import { useDispatch } from 'react-redux';
import { Dispatch } from '@reduxjs/toolkit';
import { setEditorName } from 'src/redux/actions';
import { TelegramLoginButton, TelegramUser } from 'src/components';

export const TitlePage = () => {
  const dispatch: Dispatch = useDispatch();

  const handleSetUserName = (user: TelegramUser) => {
    dispatch(setEditorName(user.username));
  };

  return (
    <>
      <div className={css.titleWrapper}>
        <img className={css.titleLogo} src={UVC} />
      </div>
      <div className={css.telegramWidget}>
        <TelegramLoginButton
          botName="SerozhsTestBot"
          dataOnauth={handleSetUserName}
          usePic={true}
        />
      </div>
    </>
  );
};
