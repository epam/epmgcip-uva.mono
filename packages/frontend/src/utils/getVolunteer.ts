import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IVolunteer } from 'src/types';
import { FirebaseCollection, NOTIFICATIONS } from 'src/constants';
import { showNotification } from './showNotification';

export const getVolunteerDocId = (telegramName: string) => telegramName.toLowerCase();

/**
 * Get volunteer by lowercase telegram name.
 * if not found and telegramId is provided, try to find by telegramId and update telegramName.
 */
export const getVolunteer = async (telegramName: string) => {
  const docId = getVolunteerDocId(telegramName);

  const docRef = doc(firebaseDb, FirebaseCollection.Volunteers, docId);
  const volunteer = await getDoc(docRef);

  if (volunteer.exists()) {
    return volunteer.data() as IVolunteer;
  }
  showNotification(NOTIFICATIONS(telegramName).VOLUNTEER_DOES_NOT_EXIST, 3000)
  return undefined;
};
