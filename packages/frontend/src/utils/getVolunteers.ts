import { FirebaseCollection } from 'uva-shared';
import { firebaseDb } from 'src/main';
import { IVolunteer } from 'uva-shared/src/types/volunteer';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  DocumentSnapshot,
  or,
  and,
} from 'firebase/firestore';
import { QueryArgs } from './getEvents';

export interface GetVolunteersResult {
  readonly volunteers: IVolunteer[];
  readonly lastVolunteer: DocumentSnapshot | null;
}

export const getVolunteers = async (
  name?: string,
  lastVolunteer?: DocumentSnapshot | null,
  pageSize = 20,
): Promise<GetVolunteersResult> => {
  let volunteers: IVolunteer[] = [];
  let querySnapshot;

  const searchByField = async () => {
    const queryArgs: QueryArgs[] = [limit(pageSize)];

    let queryForVolunteers;
    if (name) {
      const start = name.toLowerCase();
      const end = start + '\uf8ff';
      queryForVolunteers = query(
        collection(firebaseDb, FirebaseCollection.Volunteers),
        or(
          and(where('firstName', '>=', start), where('firstName', '<', end)),
          and(where('lastName', '>=', start), where('lastName', '<', end)),
        ),
        orderBy('firstName', 'desc'),
      );
    } else {
      queryForVolunteers = query(collection(firebaseDb, FirebaseCollection.Volunteers), ...queryArgs);
    }

    if (lastVolunteer) {
      queryArgs.push(startAfter(lastVolunteer));
    }
    return await getDocs(queryForVolunteers);
  };

  try {
    querySnapshot = await searchByField();
    volunteers = querySnapshot.docs.map(doc => doc.data() as IVolunteer);

    return {
      volunteers,
      lastVolunteer: volunteers.length ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
    };
  } catch (e) {
    console.error('Could not retrieve volunteers data', e);
    return { volunteers: [], lastVolunteer: null };
  }
};
