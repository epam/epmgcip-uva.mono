import { collection, doc, setDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IVolunteer } from 'src/types';
import { showNotification } from './showNotification';
import { getVolunteer, getVolunteerDocId } from './getVolunteer';
import { FirebaseCollection, NOTIFICATIONS } from 'src/constants';

export const createVolunteer = async (newVolunteer: IVolunteer): Promise<boolean> => {
  const volunteer = await getVolunteer(newVolunteer.telegramName);
  const volunteersRef = collection(firebaseDb, FirebaseCollection.Volunteers);

  if (volunteer) {
    showNotification(NOTIFICATIONS(newVolunteer.telegramName).VOLUNTEER_EXISTS, 6000);
    return false;
  }

  try {
    await setDoc(doc(volunteersRef, getVolunteerDocId(newVolunteer.telegramName)), newVolunteer);

    showNotification(NOTIFICATIONS(newVolunteer.telegramName).VOLUNTEER_CREATED, 3000);

    return true;
  } catch {
    showNotification(NOTIFICATIONS(newVolunteer.telegramName).VOLUNTEER_CREATION_ERROR, 3000);

    return false;
  }
};
