import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IUser } from 'src/types';

export const getUser = async (telegramName: string) => {
  const docRef = doc(firebaseDb, 'users', telegramName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as IUser;
  } else {
    return undefined
  }
};
