import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { FirebaseCollection } from 'src/constants';
import { firebaseDb } from 'src/main';
import { IEvent } from 'src/types';

/** Get filtered events list */
export const getEvents = async (status?: IEvent['status']): Promise<IEvent[]> => {
  const queryForEvents = status ?
    query(collection(firebaseDb, FirebaseCollection.Events), where('status', '==', status), orderBy('startDate', 'desc'))
    : query(collection(firebaseDb, FirebaseCollection.Events), orderBy('startDate', 'desc'));

  const querySnapshot = await getDocs(queryForEvents);
  return querySnapshot.docs.map(doc => doc.data() as IEvent);
};
