import { collection, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import {
  DEFAULT_MAX_AGE,
  DEFAULT_MIN_AGE,
  FirebaseCollection,
  NOTIFICATIONS,
  STORAGE_BUCKET,
  STORAGE_IMAGES_PATH,
} from 'src/constants';
import { firebaseDb } from 'src/main';
import { EventStatus, IEvent } from 'src/types';
import { getEvent, getEventNameInLanguage } from './getEvent';
import { showNotification } from './showNotification';

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

export const isCreateFormDirty = (
  newEvent: Omit<IEvent, 'id' | 'languageSpecificData' | 'image' | 'ageMin' | 'ageMax' | 'status'>,
  languageSpecificData: IEvent['languageSpecificData'],
  maxVolunteersAge: number,
  minVolunteersAge: number,
  eventStatus: IEvent['status']
): boolean => {
  return (
    Object.values(newEvent).some(value => !!value) ||
    Object.values(languageSpecificData.data).some(
      lang => !!lang.name || !!lang.description || !!lang.place
    ) ||
    minVolunteersAge !== DEFAULT_MIN_AGE ||
    maxVolunteersAge !== DEFAULT_MAX_AGE ||
    eventStatus !== EventStatus.Draft
  );
};
