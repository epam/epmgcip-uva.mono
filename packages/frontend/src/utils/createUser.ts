import { collection, doc, setDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IUser, FirebaseCollection } from 'uva-shared';
import { showNotification } from './showNotification';
import { getUser } from './getUser';
import { getUserDocId } from 'uva-shared';
import { NOTIFICATIONS } from 'src/constants';

export const createUser = async (newUser: IUser): Promise<boolean> => {
  const user = await getUser(newUser.telegramName);
  const usersRef = collection(firebaseDb, FirebaseCollection.Users);

  if (user) {
    showNotification(NOTIFICATIONS(newUser.telegramName).USER_EXISTS, 6000);
    return false;
  }

  try {
    await setDoc(doc(usersRef, getUserDocId(newUser.telegramName)), newUser);

    showNotification(NOTIFICATIONS(newUser.telegramName).USER_CREATED, 3000);

    return true;
  } catch {
    showNotification(NOTIFICATIONS(newUser.telegramName).USER_CREATION_ERROR, 3000);

    return false;
  }
};
