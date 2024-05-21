import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { FirebaseCollection } from 'src/constants';
import { firebaseDb } from 'src/main';
import { FilterEventStatuses, IEvent } from 'src/types';

/** Get filtered events list 
 * todo: make it actually pagable 
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getEvents = async (status?: FilterEventStatuses, _page: number = 0): Promise<IEvent[]> => {
  const queryForEvents = status !== 'all' ?
    query(collection(firebaseDb, FirebaseCollection.Events), where('status', '==', status), orderBy('startDate', 'desc'))
    : query(collection(firebaseDb, FirebaseCollection.Events), orderBy('startDate', 'desc'));

  const querySnapshot = await getDocs(queryForEvents);
  return querySnapshot.docs.map(doc => doc.data() as IEvent);
};
