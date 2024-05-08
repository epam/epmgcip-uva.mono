import { collection, doc, setDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IEvent } from 'src/types';
import { showNotification } from './showNotification';
import { FirebaseCollection, NOTIFICATIONS } from 'src/constants';
import { getEvent, getEventNameInLanguage } from './getEvent';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

export const createEvent = async (newEvent: IEvent, image: File): Promise<boolean> => {
  const event = await getEvent(newEvent.id);
  const eventsRef = collection(firebaseDb, FirebaseCollection.Events);

  if (event) {
    showNotification(NOTIFICATIONS(newEvent.id).EVENT_EXISTS, 6000);
    return false;
  }

  const storage = getStorage();
  const storageRef = ref(
    storage,
    `${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}/public/${newEvent.id}`
  );

  try {
    await uploadBytes(storageRef, image);
    await setDoc(doc(eventsRef, newEvent.id), newEvent);

    showNotification(NOTIFICATIONS(getEventNameInLanguage(newEvent)).EVENT_CREATED, 3000);

    return true;
  } catch {
    showNotification(NOTIFICATIONS(getEventNameInLanguage(newEvent)).EVENT_CREATION_ERROR, 3000);

    return false;
  }
};
