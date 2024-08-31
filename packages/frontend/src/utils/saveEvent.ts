import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { DEFAULT_MAX_AGE, DEFAULT_MIN_AGE, NOTIFICATIONS, STORAGE_BUCKET, STORAGE_IMAGES_PATH } from 'src/constants';
import { firebaseDb } from 'src/main';
import { EventStatus, IEvent, FirebaseCollection } from 'uva-shared';
import { getEvent, getEventNameInLanguage } from './getEvent';
import { showNotification } from './showNotification';

export const saveEvent = async (
  newOrUpdatedEvent: IEvent | Partial<IEvent>,
  image: File,
  addOrUpdate: 'add' | 'update' = 'add',
): Promise<boolean> => {
  const event = await getEvent(newOrUpdatedEvent.id!);
  const eventsRef = collection(firebaseDb, FirebaseCollection.Events);
  let downloadUrl = '';

  if (event && addOrUpdate !== 'update') {
    showNotification(NOTIFICATIONS(newOrUpdatedEvent.id).EVENT_EXISTS, 6000);
    return false;
  }

  const storage = getStorage();

  const imageStorageRef = ref(storage, `${STORAGE_BUCKET}/${STORAGE_IMAGES_PATH}/${newOrUpdatedEvent.id}`);
  try {
    if ((addOrUpdate == 'update' && image !== null) || addOrUpdate == 'add') {
      await uploadBytes(imageStorageRef, image);
      downloadUrl = await getDownloadURL(imageStorageRef);
    }
    if (addOrUpdate == 'add') {
      await setDoc(doc(eventsRef, newOrUpdatedEvent.id), {
        ...newOrUpdatedEvent,
        imageUrl: downloadUrl,
      });
    } else {
      await updateDoc(doc(eventsRef, newOrUpdatedEvent.id), {
        ...newOrUpdatedEvent,
        imageUrl: image ? downloadUrl : newOrUpdatedEvent.imageUrl,
      } as Partial<IEvent>);
    }

    showNotification(
      NOTIFICATIONS(getEventNameInLanguage(newOrUpdatedEvent))[addOrUpdate == 'add' ? 'EVENT_CREATED' : 'EVENT_UPDATED'],
      3000,
    );

    return true;
  } catch {
    showNotification(NOTIFICATIONS(getEventNameInLanguage(newOrUpdatedEvent)).EVENT_CREATION_ERROR, 3000);

    return false;
  }
};

export const isCreateFormDirty = (
  newOrUpdatedEvent: Omit<IEvent, 'id' | 'languageSpecificData' | 'image' | 'ageMin' | 'ageMax' | 'status'>,
  languageSpecificData: IEvent['languageSpecificData'],
  maxVolunteersAge: number,
  minVolunteersAge: number,
  eventStatus: IEvent['status'],
): boolean => {
  return (
    Object.values(newOrUpdatedEvent).some(value => !!value) ||
    Object.values(languageSpecificData.data).some(lang => !!lang.name || !!lang.description || !!lang.place) ||
    minVolunteersAge !== DEFAULT_MIN_AGE ||
    maxVolunteersAge !== DEFAULT_MAX_AGE ||
    eventStatus !== EventStatus.Draft
  );
};
