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

export const getUser = async (telegramName: string, telegramId?: number) => {
  const docRef = doc(firebaseDb, 'users', telegramName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as IUser;
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
