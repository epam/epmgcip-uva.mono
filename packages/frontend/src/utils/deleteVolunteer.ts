import { collection, deleteDoc, doc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { getVolunteer } from './getVolunteer';
import { FirebaseCollection } from 'src/constants';

export const deleteVolunteer = async (telegramId: string): Promise<boolean> => {
  const volunteer = await getVolunteer(telegramId);
  const volunteerRef = collection(firebaseDb, FirebaseCollection.Volunteers);

  if (!volunteer) return false;

  try {
    await deleteDoc(doc(volunteerRef, telegramId));
    return true;
  } catch {
    return false;
  }
};
