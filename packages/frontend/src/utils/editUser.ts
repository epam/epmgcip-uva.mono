import { collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IUser } from 'src/types';
import { showNotification } from './showNotification';
import { getUser } from './getUser';
import { getUserDocId } from 'uva-shared';
import { NOTIFICATIONS } from 'src/constants';
import { FirebaseCollection } from 'uva-shared';

export const editUser = async (
  telegramName: string,
  updatedFields: Partial<IUser>,
  isShowNotification = true,
): Promise<boolean> => {
  const docId = getUserDocId(telegramName);
  const user = await getUser(docId);
  const usersRef = collection(firebaseDb, FirebaseCollection.Users);

  if (!user) {
    isShowNotification && showNotification(NOTIFICATIONS(telegramName).USER_DOES_NOT_EXIST, 6000);
    return false;
  }

  try {
    if (updatedFields.telegramName && docId !== getUserDocId(updatedFields.telegramName)) {
      const duplicate = await getUser(docId);

      if (duplicate) {
        isShowNotification && showNotification(NOTIFICATIONS(updatedFields.telegramName).USER_EXISTS, 6000);
        return false;
      }

      await setDoc(doc(usersRef, docId), {
        ...user,
        ...updatedFields,
      });
      deleteDoc(doc(usersRef, docId));
    } else {
      await updateDoc(doc(usersRef, docId), { ...updatedFields });
    }

    isShowNotification && showNotification(NOTIFICATIONS(telegramName).USER_UPDATED, 3000);

    return true;
  } catch {
    isShowNotification && showNotification(NOTIFICATIONS(telegramName).USER_UPDATE_ERROR, 3000);

    return false;
  }
};
