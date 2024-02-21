import { collection, doc, updateDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IUser } from 'src/types';
import { showNotification } from './showNotification';
import { getUser } from './getUser';
import { NOTIFICATIONS } from 'src/constants';

export const editUser = async (
  telegramName: string,
  name: string,
  updatedFields: Partial<IUser>
): Promise<boolean> => {
  const user = await getUser(telegramName);
  const usersRef = collection(firebaseDb, 'users');

  if (!user) {
    showNotification(NOTIFICATIONS(name).USER_DOES_NOT_EXIST, 6000);
    return false;
  }

  try {
    await updateDoc(doc(usersRef, telegramName), { ...updatedFields });

    showNotification(NOTIFICATIONS(name).USER_UPDATED, 3000);

    return true;
  } catch {
    showNotification(NOTIFICATIONS(name).USER_UPDATE_ERROR, 3000);

    return false;
  }
};
