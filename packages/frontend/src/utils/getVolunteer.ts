import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IVolunteer } from 'src/types';
import { FirebaseCollection } from 'src/constants';

export const getVolunteer = async (telegramId: string) => {
  const docRef = doc(firebaseDb, FirebaseCollection.Volunteers, telegramId);
  const volunteer = await getDoc(docRef);

  if (volunteer.exists()) {
    return volunteer.data() as IVolunteer;
  }
  return undefined;
};
