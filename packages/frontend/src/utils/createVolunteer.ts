import { collection, doc, setDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { firebaseDb } from 'src/main';
import { IVolunteer } from 'src/types';
import { showNotification } from './showNotification';
import { getVolunteer, getVolunteerDocId } from './getVolunteer';
import { FirebaseCollection, NOTIFICATIONS, STORAGE_BUCKET, VOLUNTEERS_IMAGES_PATH } from 'src/constants';

export const createVolunteer = async (newVolunteer: IVolunteer, image: File): Promise<boolean> => {
  const volunteer = await getVolunteer(newVolunteer.telegramName);
  const volunteersRef = collection(firebaseDb, FirebaseCollection.Volunteers);

  if (volunteer) {
    showNotification(NOTIFICATIONS(newVolunteer.telegramName).VOLUNTEER_EXISTS, 6000);
    return false;
  }

  try {
    const storage = getStorage();

    const imageStorageRef = ref(
      storage,
      `${STORAGE_BUCKET}/${VOLUNTEERS_IMAGES_PATH}/${getVolunteerDocId(newVolunteer.telegramName)}`
    );

    await uploadBytes(imageStorageRef, image);
    const downloadUrl = await getDownloadURL(imageStorageRef);
    await setDoc(doc(volunteersRef, getVolunteerDocId(newVolunteer.telegramName)), {
      ...newVolunteer,
      imageURL: downloadUrl,
    });

    showNotification(NOTIFICATIONS(newVolunteer.telegramName).VOLUNTEER_CREATED, 3000);

    return true;
  } catch {
    showNotification(NOTIFICATIONS(newVolunteer.telegramName).VOLUNTEER_CREATION_ERROR, 3000);

    return false;
  }
};
