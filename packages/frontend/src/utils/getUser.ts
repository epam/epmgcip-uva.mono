import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IUser } from 'src/types';
import { editUser } from './editUser';
import { FirebaseCollection } from 'src/constants';

export const getUserDocId = (telegramName: string) => telegramName.toLowerCase();

/**
 * Get user by lowercase telegram name.
 * if not found and telegramId is provided, try to find by telegramId and update telegramName.
 */
export const getUser = async (telegramName: string, telegramId?: number) => {
  const docId = getUserDocId(telegramName);

  const docRef = doc(firebaseDb, FirebaseCollection.Users, docId);
  const user = await getDoc(docRef);

  if (user.exists()) {
    return user.data() as IUser;
  }

  if (telegramId) {
    const queryForUserById = query(
      collection(firebaseDb, FirebaseCollection.Users),
      where('telegramId', '==', telegramId)
    );

    const querySnapshot = await getDocs(queryForUserById);

    if (querySnapshot.size === 1) {
      querySnapshot.forEach(docSnap => {
        const user = docSnap.data() as IUser;

        editUser(user.telegramName, { telegramName }, false);

        return getUser(telegramName);
      });
    }

    return undefined;
  }

  return undefined;
};
