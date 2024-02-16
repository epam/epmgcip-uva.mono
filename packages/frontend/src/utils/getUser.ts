import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';

export const getUser = async (telegramName: string) => {
  const docRef = doc(firebaseDb, 'users', telegramName);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    return undefined
  }
};
