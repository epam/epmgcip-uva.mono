import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IUser } from 'src/types';
import { showNotification } from './showNotification';
import { getUser } from './getUser';
import { NOTIFICATIONS } from 'src/constants';

export const editUser = async (
  telegramName: string,
  updatedFields: Partial<IUser>
): Promise<boolean> => {
  const user = await getUser(telegramName);
  const usersRef = collection(firebaseDb, 'users');

  if (!user) {
    showNotification(NOTIFICATIONS(telegramName).USER_DOES_NOT_EXIST, 6000);
    return false;
  }

  try {
    if (updatedFields.telegramName) {
      const dublicate = await getUser(updatedFields.telegramName);

      if (dublicate) {
        showNotification(NOTIFICATIONS(updatedFields.telegramName).USER_EXISTS, 6000);
        return false;
      }

      await setDoc(doc(usersRef, updatedFields.telegramName), {
        ...user,
        ...updatedFields,
      });
      deleteDoc(doc(usersRef, telegramName));
    } else {
      await updateDoc(doc(usersRef, telegramName), { ...updatedFields });
    }

    showNotification(NOTIFICATIONS(telegramName).USER_UPDATED, 3000);

    return true;
  } catch {
    showNotification(NOTIFICATIONS(telegramName).USER_UPDATE_ERROR, 3000);

    return false;
  }
};
