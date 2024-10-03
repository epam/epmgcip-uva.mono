import { collection, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { firebaseDb } from 'src/main';
import { IVolunteer } from 'src/types';
import { showNotification } from './showNotification';
import { getVolunteer } from './getVolunteer';
import { FirebaseCollection, NOTIFICATIONS, STORAGE_BUCKET, VOLUNTEERS_IMAGES_PATH } from 'src/constants';

export const createVolunteer = async (newVolunteer: IVolunteer, image: File): Promise<boolean> => {
  const volunteer = await getVolunteer(newVolunteer.telegramId);
  const volunteersRef = collection(firebaseDb, FirebaseCollection.Volunteers);

  if (volunteer) {
    showNotification(NOTIFICATIONS().VOLUNTEER_EXISTS, 6000);
    return false;
  }

  try {
    const storage = getStorage();

    const imageStorageRef = ref(
      storage,
      `${STORAGE_BUCKET}/${VOLUNTEERS_IMAGES_PATH}/${newVolunteer.telegramId}`
    );

    await uploadBytes(imageStorageRef, image);
    const downloadUrl = await getDownloadURL(imageStorageRef);
    await setDoc(doc(volunteersRef, newVolunteer.telegramId), {
      ...newVolunteer,
      imageURL: downloadUrl,
    });

    showNotification(NOTIFICATIONS().VOLUNTEER_CREATED, 3000);

    return true;
  } catch {
    showNotification(NOTIFICATIONS().VOLUNTEER_CREATION_ERROR, 3000);

    return false;
  }
};
