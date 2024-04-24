import { useNavigate } from 'react-router-dom';
import css from './TitlePage.module.sass';
import UVC from 'src/assets/uvc-logo.png';
import {
  DEVELOPMENT_ENVIRONMENT_URL,
  EVENTS_ROUTE,
  LOCAL_ENVIRONMENT,
  TEST_ENVIRONMENTS,
  NOTIFICATIONS,
} from 'src/constants';
import { Button, Loader } from 'src/components';
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
import { useEffect, useState } from 'react';
import { editUser } from 'src/utils/editUser';

const checkIsLocalEnv = (currentUrl: string) =>
  LOCAL_ENVIRONMENT.some(
    url => currentUrl.includes(url) && currentUrl !== DEVELOPMENT_ENVIRONMENT_URL
  );

const checkIsTestOrLocalEnv = (currentUrl: string) =>
  [...TEST_ENVIRONMENTS, ...LOCAL_ENVIRONMENT].some(
    url => currentUrl.includes(url) && currentUrl !== DEVELOPMENT_ENVIRONMENT_URL
  );

export const TitlePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const isLocalEnv = checkIsLocalEnv(window.location.href);
    if (isLocalEnv) {
      // to save time on login every page refresh
      // handleSetUser(ADMIN_ACTIVE_MOCK.telegramName);
      dispatch(setEditor(ADMIN_ACTIVE_MOCK));
      navigate(EVENTS_ROUTE);
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const isLocalOrTestEnv = checkIsTestOrLocalEnv(window.location.href);

  const handleSetUser = (telegramName: string, telegramId?: number) => {
    setIsLoading(() => true);
    getUser(telegramName, telegramId).then((user: IUser | undefined) => {
      if (user && checkUserAuthorization(user)) {
        if (telegramId && user && !user.telegramId) {
          user.telegramId = telegramId;
          editUser(telegramName, { telegramId }, false);
        }
        dispatch(setEditor(user));
        navigate(EVENTS_ROUTE);
      } else {
        setIsLoading(() => false);
        showNotification(NOTIFICATIONS().USER_DOES_NOT_HAVE_ACCESS, 6000);
      }
    });
  };

  return (
    <>
      <div className={css.titleWrapper}>
        <img className={css.titleLogo} src={UVC} />
      </div>
      <div className={css.telegramWidget}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            {isLocalOrTestEnv ? (
              <>
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
                  onClick={() => handleSetUser(ADMIN_INACTIVE_MOCK.telegramName)}
                  className={css.setUserButton}
                >
                  Админ неактив
                </Button>
                <Button
                  onClick={() => handleSetUser(COORDINATOR_INACTIVE_MOCK.telegramName)}
                  className={css.setUserButton}
                >
                  Координатор неактив
                </Button>
              </>
            ) : (
              <TelegramLoginButton
                botName="SerozhsTestBot"
                dataOnauth={user => handleSetUser(`@${user.username}`, user.id)}
                usePic={true}
              />
            )}
          </>
        )}
      </div>
    </>
  );
};
