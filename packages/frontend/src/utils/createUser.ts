import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IUserCreation } from 'src/types';
import { showNotification } from './showNotification';
import { getUser } from './getUser';
import { v4 as uuidv4 } from 'uuid';
import { NOTIFICATIONS } from 'src/constants';

export const createUser = async (newUser: IUserCreation, createdBy: string) => {
  const user = await getUser(newUser.telegramName);
  const usersRef = collection(firebaseDb, 'users');

  if (user) {
    showNotification(NOTIFICATIONS(newUser.name).USER_EXISTS, 6000);
    return;
  }

  try {
    await setDoc(doc(usersRef, newUser.telegramName), {
      ...newUser,
      id: uuidv4(),
      createdAt: serverTimestamp(),
      createdBy: createdBy,
    });

    showNotification(NOTIFICATIONS(newUser.name).USER_CREATED, 3000);
  } catch (e) {
    showNotification(NOTIFICATIONS(newUser.name).USER_CREATION_ERROR, 3000);
  }
};
