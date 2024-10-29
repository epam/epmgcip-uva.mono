import { collection, doc, updateDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IVolunteer } from 'src/types';
import { getVolunteer } from './getVolunteer';
import { FirebaseCollection } from 'src/constants';

export const editVolunteer = async (telegramId: string, updatedFields: Partial<IVolunteer>): Promise<boolean> => {
  const volunteer = await getVolunteer(telegramId);
  const volunteerRef = collection(firebaseDb, FirebaseCollection.Volunteers);

  if (!volunteer) return false;

  try {
    await updateDoc(doc(volunteerRef, telegramId), { ...updatedFields });
    return true;
  } catch {
    return false;
  }
};
