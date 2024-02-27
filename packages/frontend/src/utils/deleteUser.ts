import { collection, deleteDoc, doc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { showNotification } from './showNotification';
import { getUser } from './getUser';
import { NOTIFICATIONS } from 'src/constants';

export const deleteUser = async (
  telegramName: string,
): Promise<boolean> => {
  const user = await getUser(telegramName);
  const usersRef = collection(firebaseDb, 'users');

  if (!user) {
    showNotification(NOTIFICATIONS(telegramName).USER_DOES_NOT_EXIST, 6000);
    return false;
  }

  try {
    await deleteDoc(doc(usersRef, telegramName));

    showNotification(NOTIFICATIONS(telegramName).USER_DELETED, 3000);

    return true;
  } catch {
    showNotification(NOTIFICATIONS(telegramName).USER_DELETE_ERROR, 3000);

    return false;
  }
};