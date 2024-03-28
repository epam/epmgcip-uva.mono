import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IEvent } from 'src/types';

export const getEvent = async (eventId: string) => {
  const docRef = doc(firebaseDb, 'events', eventId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as IEvent;
  }

  return undefined;
};
