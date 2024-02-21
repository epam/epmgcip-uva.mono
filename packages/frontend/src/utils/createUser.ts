import { collection, doc, setDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IUser } from 'src/types';
import { showNotification } from './showNotification';
import { getUser } from './getUser';
import { NOTIFICATIONS } from 'src/constants';

export const createUser = async (newUser: IUser): Promise<boolean> => {
  const user = await getUser(newUser.telegramName);
  const usersRef = collection(firebaseDb, 'users');

  if (user) {
    showNotification(NOTIFICATIONS(newUser.name).USER_EXISTS, 6000);
    return false;
  }

  try {
    await setDoc(doc(usersRef, newUser.telegramName), newUser);

    showNotification(NOTIFICATIONS(newUser.name).USER_CREATED, 3000);

    return true;
  } catch {
    showNotification(NOTIFICATIONS(newUser.name).USER_CREATION_ERROR, 3000);

    return false;
  }
};
