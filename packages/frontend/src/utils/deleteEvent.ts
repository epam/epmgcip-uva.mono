import {firebaseDb} from 'src/main';
import { doc, deleteDoc } from 'firebase/firestore';
import { FirebaseCollection, NOTIFICATIONS } from 'src/constants';
import { showNotification } from './showNotification';
import { getEvent, getEventNameInLanguage } from './getEvent';

export const deleteEvent = async(eventId: string): Promise<void> => {
  const event = await getEvent(eventId);
    try{
        const docRef = doc(firebaseDb, FirebaseCollection.Events, eventId);
        await deleteDoc(docRef)
        showNotification(NOTIFICATIONS(getEventNameInLanguage(event!)).EVENT_DELETED, 3000);
    }catch{
        showNotification(NOTIFICATIONS(eventId).EVENT_DELETE_ERROR, 3000);
    }
} 