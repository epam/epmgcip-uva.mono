import { jwtDecode } from 'jwt-decode';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UVC from 'src/assets/uvc-logo.png';
import { Button, Loader, TelegramLoginButton, TelegramUser } from 'src/components';
import {
  DEVELOPMENT_ENVIRONMENT_URL,
  EVENTS_ROUTE,
  LOCAL_ENVIRONMENT,
  NOTIFICATIONS,
  TEST_ENVIRONMENTS,
} from 'src/constants';
import { ADMIN_ACTIVE_MOCK, ADMIN_INACTIVE_MOCK, COORDINATOR_ACTIVE_MOCK, COORDINATOR_INACTIVE_MOCK } from 'src/mocks';
import { setEditor } from 'src/redux/actions';
import { checkUserAuthorization, getToken } from 'src/utils/auth';
import { editUser } from 'src/utils/editUser';
import { IUser } from 'uva-shared';

import { getAuth, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getUser } from 'src/utils/getUser';
import { showNotification } from 'src/utils/showNotification';
import css from './TitlePage.module.sass';

const checkIsLocalEnv = (currentUrl: string) =>
  LOCAL_ENVIRONMENT.some(url => currentUrl.includes(url) && currentUrl !== DEVELOPMENT_ENVIRONMENT_URL);

const checkIsTestOrLocalEnv = (currentUrl: string) =>
  [...TEST_ENVIRONMENTS, ...LOCAL_ENVIRONMENT].some(
    url => currentUrl.includes(url) && currentUrl !== DEVELOPMENT_ENVIRONMENT_URL,
  );

export const TitlePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isLocalOrTestEnv = checkIsTestOrLocalEnv(window.location.href);

  const [isLoading, setIsLoading] = useState(false);
  const auth = useMemo(() => getAuth(), []);

  const accessGranted = useCallback(
    (user: IUser) => {
      setIsLoading(false);
      dispatch(setEditor(user));
      navigate(EVENTS_ROUTE);
    },
    [dispatch, navigate],
  );

  const noAccess = useCallback(() => {
    setIsLoading(() => false);
    showNotification(NOTIFICATIONS().USER_DOES_NOT_HAVE_ACCESS, 6000);
  }, []);

  // todo: check how all of these works
  const handleSetUser = useCallback(
    (tgUser: TelegramUser) => {
      const [telegramName, telegramId] = [`@${tgUser.username}`, tgUser.id];
      setIsLoading(() => true);
      getUser(telegramName, telegramId)
        .then(async (user: IUser | undefined) => {
          if (!user || !checkUserAuthorization(user) || !tgUser) {
            noAccess();
            return;
          }

          const token = await getToken(tgUser);
          if (!token) {
            noAccess();
            return;
          }

          const userCredential = await signInWithCustomToken(auth, token);
          if (!userCredential || !userCredential.user) {
            noAccess();
            return;
          }

          await userCredential.user.getIdToken();

          if (telegramId && !user.telegramId) {
            user.telegramId = telegramId;
            editUser(telegramName, { telegramId }, false);
          }

          accessGranted(user);
        })
        .catch(() => {
          noAccess();
        });
    },
    [accessGranted, auth, noAccess],
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async authUser => {
      if (authUser) {
        const token = await authUser.getIdToken();
        try {
          const decodedToken = jwtDecode(token);
          // todo: check if really sub
          const telegramName = decodedToken.sub;
          if (!telegramName) {
            noAccess();
            return;
          }
          const user = await getUser(telegramName);
          if (!user || !checkUserAuthorization(user)) {
            noAccess();
            return;
          }
          accessGranted(user);
        } catch (error) {
          noAccess();
          return;
        }
      } else {
        const isLocalEnv = checkIsLocalEnv(window.location.href);
        if (isLocalEnv) {
          handleSetUser(ADMIN_ACTIVE_MOCK.tgUser);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [accessGranted, auth, handleSetUser, noAccess]);

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
                <Button onClick={() => handleSetUser(ADMIN_ACTIVE_MOCK.tgUser)} className={css.setUserButton}>
                  Админ
                </Button>
                <Button onClick={() => handleSetUser(COORDINATOR_ACTIVE_MOCK.tgUser)} className={css.setUserButton}>
                  Координатор
                </Button>
                <Button onClick={() => handleSetUser(ADMIN_INACTIVE_MOCK.tgUser)} className={css.setUserButton}>
                  Админ неактив
                </Button>
                <Button onClick={() => handleSetUser(COORDINATOR_INACTIVE_MOCK.tgUser)} className={css.setUserButton}>
                  Координатор неактив
                </Button>
              </>
            ) : (
              <TelegramLoginButton botName="SerozhsTestBot" dataOnauth={user => handleSetUser(user)} usePic={true} />
            )}
          </>
        )}
      </div>
    </>
  );
};
