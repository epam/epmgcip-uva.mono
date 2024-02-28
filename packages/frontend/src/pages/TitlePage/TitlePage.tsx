import { useNavigate } from 'react-router-dom';
import css from './TitlePage.module.sass';
import UVC from 'src/assets/uvc-logo.png';
import { EVENTS_ROUTE, NOTIFICATIONS } from 'src/constants';
import { Button } from 'src/components';
import { IUser, UserStatus } from 'src/types';
import { useDispatch } from 'react-redux';
import { TelegramLoginButton } from 'src/components';
import { setEditor } from 'src/redux/actions';
import { ADMIN_MOCK, COORDINATOR_MOCK } from 'src/mocks';
import { checkUserAuthorization, getUser, showNotification } from 'src/utils';

export const TitlePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSetUser = (telegramName: string) => {
    getUser(telegramName).then((user: IUser | undefined) => {
      if (checkUserAuthorization(user)) {
        dispatch(setEditor(user as IUser));
        navigate(EVENTS_ROUTE)
      } else {
        showNotification(NOTIFICATIONS().USER_DOES_NOT_HAVE_ACCESS, 6000)
      }
  
    })
  };

  return (
    <>
      <div className={css.titleWrapper}>
        <img className={css.titleLogo} src={UVC} />
      </div>
      <div className={css.telegramWidget}>
        <TelegramLoginButton
          botName="SerozhsTestBot"
          dataOnauth={(user) => handleSetUser(user.username)}
          usePic={true}
        />
        <Button
          onClick={() => handleSetUser(ADMIN_MOCK.telegramName)}
          className={css.setUserButton}
        >
          Админ
        </Button>
        <Button
          onClick={() => handleSetUser(COORDINATOR_MOCK.telegramName)}
          className={css.setUserButton}
        >
          Координатор
        </Button>
        <Button
          onClick={() => handleSetUser({ ...ADMIN_MOCK, status: UserStatus.Inactive })}
          className={css.setUserButton}
        >
          Админ неактив
        </Button>
        <Button
          onClick={() => handleSetUser({ ...COORDINATOR_MOCK, status: UserStatus.Inactive })}
          className={css.setUserButton}
        >
          Координатор неактив
        </Button>
      </div>
    </>
  );
};
