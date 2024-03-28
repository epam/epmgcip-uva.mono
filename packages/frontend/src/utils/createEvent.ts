import { collection, doc, setDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IEvent } from 'src/types';
import { showNotification } from './showNotification';
import { NOTIFICATIONS } from 'src/constants';
import { getEvent } from './getEvent';
import { getStorage, ref, uploadBytes } from 'firebase/storage';

export const createEvent = async (newEvent: IEvent, image: File): Promise<boolean> => {
  const event = await getEvent(newEvent.id);
  const eventsRef = collection(firebaseDb, 'events');

  if (event) {
    showNotification(NOTIFICATIONS(newEvent.id).EVENT_EXISTS, 6000);
    return false;
  }

  const storage = getStorage();
  const storageRef = ref(storage, `${import.meta.env.VITE_FIREBASE_STORAGE_BUCKET}/public/${newEvent.id}`);

  try {
    await uploadBytes(storageRef, image);
    await setDoc(doc(eventsRef, newEvent.id), newEvent);

    showNotification(NOTIFICATIONS(newEvent.name).EVENT_CREATED, 3000);

    return true;
  } catch {
    showNotification(NOTIFICATIONS(newEvent.name).EVENT_CREATION_ERROR, 3000);

    return false;
  }
};
