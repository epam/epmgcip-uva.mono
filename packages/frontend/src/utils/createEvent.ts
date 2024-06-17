import { collection, doc, setDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IEvent } from 'src/types';
import { showNotification } from './showNotification';
import {
  FirebaseCollection,
  NOTIFICATIONS,
  STORAGE_BUCKET,
  STORAGE_IMAGES_PATH,
} from 'src/constants';
import { getEvent, getEventNameInLanguage } from './getEvent';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const createEvent = async (newEvent: IEvent, image: File): Promise<boolean> => {
  const event = await getEvent(newEvent.id);
  const eventsRef = collection(firebaseDb, FirebaseCollection.Events);

  if (event) {
    showNotification(NOTIFICATIONS(newEvent.id).EVENT_EXISTS, 6000);
    return false;
  }

  const storage = getStorage();

  const imageStorageRef = ref(storage, `${STORAGE_BUCKET}/${STORAGE_IMAGES_PATH}/${newEvent.id}`);

  try {
    await uploadBytes(imageStorageRef, image);
    const downloadUrl = await getDownloadURL(imageStorageRef);

    await setDoc(doc(eventsRef, newEvent.id), { ...newEvent, imageUrl: downloadUrl });

    showNotification(NOTIFICATIONS(getEventNameInLanguage(newEvent)).EVENT_CREATED, 3000);

    return true;
  } catch {
    showNotification(NOTIFICATIONS(getEventNameInLanguage(newEvent)).EVENT_CREATION_ERROR, 3000);

    return false;
  }
};
