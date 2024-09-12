import {
  QueryFieldFilterConstraint,
  QueryLimitConstraint,
  QueryOrderByConstraint,
  QueryStartAtConstraint,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { FilterEventStatuses } from 'src/types';
import { IEvent, FirebaseCollection } from 'uva-shared';

type QueryArgs = QueryFieldFilterConstraint | QueryOrderByConstraint | QueryStartAtConstraint | QueryLimitConstraint;

interface GetEventsResult {
  readonly events: IEvent[];
  readonly lastEventStartDate: IEvent['startDate'] | null;
}

/** Get filtered events list */
export const getEvents = async (
  status?: FilterEventStatuses,
  lastElementStartDate?: IEvent['startDate'] | undefined | null,
  pageSize = 10,
): Promise<GetEventsResult> => {
  const queryArgs: QueryArgs[] = [orderBy('startDate', 'desc'), limit(pageSize)];
  if (status && status !== 'all') {
    queryArgs.push(where('status', '==', status));
  }
  if (lastElementStartDate) {
    queryArgs.push(startAfter(lastElementStartDate));
  }
  const queryForEvents = query(collection(firebaseDb, FirebaseCollection.Events), ...queryArgs);
  try {
    const querySnapshot = await getDocs(queryForEvents);

    const events = querySnapshot.docs.map(doc => doc.data() as IEvent);
    return {
      events,
      lastEventStartDate: events.length ? events[events.length - 1].startDate : null,
    };
  } catch (e) {
    console.error('Could not retrieve events data', e);
    return { events: [], lastEventStartDate: null };
  }
};
