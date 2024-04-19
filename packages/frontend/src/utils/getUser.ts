import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IUser } from 'src/types';
import { editUser } from './editUser';

export const getUserDocId = (telegramName: string) =>
  telegramName.toLowerCase();

/**
 * Get user by lowercase telegram name.
 * if not found and there name is not lowercase initially, try to find by original case and update to lowercase.
 * if not found and telegramId is provided, try to find by telegramId and update telegramName.
 */
export const getUser = async (telegramName: string, telegramId?: number) => {
  const docId = getUserDocId(telegramName);

  const docRef = doc(firebaseDb, 'users', docId);
  const user = await getDoc(docRef);

  if (user.exists()) {
    return user.data() as IUser;
  }

  if (telegramName !== docId) {
    const docRef = doc(firebaseDb, 'users', telegramName);
    const user = await getDoc(docRef);

    if (user.exists()) {
      // not awaiting because it is not necessary to wait for the result
      editUser(telegramName, { telegramName }, false);
      return user.data() as IUser;
    }
  }

  if (telegramId) {
    const queryForUserById = query(
      collection(firebaseDb, 'users'),
      where('telegramId', '==', telegramId)
    );

    const querySnapshot = await getDocs(queryForUserById);

    if (querySnapshot.size === 1) {
      querySnapshot.forEach((docSnap) => {
        const user = docSnap.data() as IUser;

        editUser(user.telegramName, { telegramName }, false);

        return getUser(telegramName);
      });
    }

    return undefined;
  }

  return undefined;
};
