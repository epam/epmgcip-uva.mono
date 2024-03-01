import { useNavigate } from 'react-router-dom';
import css from './TitlePage.module.sass';
import UVC from 'src/assets/uvc-logo.png';
import { EVENTS_ROUTE, NOTIFICATIONS } from 'src/constants';
import { Button } from 'src/components';
import { IUser } from 'src/types';
import { useDispatch } from 'react-redux';
import { TelegramLoginButton } from 'src/components';
import { setEditor } from 'src/redux/actions';
import {
  ADMIN_ACTIVE_MOCK,
  ADMIN_INACTIVE_MOCK,
  COORDINATOR_ACTIVE_MOCK,
  COORDINATOR_INACTIVE_MOCK,
} from 'src/mocks';
import { checkUserAuthorization } from 'src/utils/checkUserAuthorization';
import { showNotification } from 'src/utils/showNotification';
import { getUser } from 'src/utils/getUser';

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
          dataOnauth={(user) => handleSetUser(`@${user.username}`)}
          usePic={true}
        />
        <Button
          onClick={() => handleSetUser(ADMIN_ACTIVE_MOCK.telegramName)}
          className={css.setUserButton}
        >
          Админ
        </Button>
        <Button
          onClick={() => handleSetUser(COORDINATOR_ACTIVE_MOCK.telegramName)}
          className={css.setUserButton}
        >
          Координатор
        </Button>
        <Button
          onClick={() =>
            handleSetUser(ADMIN_INACTIVE_MOCK.telegramName)
          }
          className={css.setUserButton}
        >
          Админ неактив
        </Button>
        <Button
          onClick={() =>
            handleSetUser(COORDINATOR_INACTIVE_MOCK.telegramName)
          }
          className={css.setUserButton}
        >
          Координатор неактив
        </Button>
      </div>
    </>
  );
};
