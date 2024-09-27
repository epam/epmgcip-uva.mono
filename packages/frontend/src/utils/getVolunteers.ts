import { FirebaseCollection } from 'uva-shared';
import { firebaseDb } from 'src/main';
import { IVolunteer } from 'uva-shared/src/types/volunteer';
import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
import { QueryArgs } from './getEvents';

export interface GetVolunteersResult {
  readonly volunteers: IVolunteer[];
  readonly lastVolunteer: DocumentSnapshot | null;
}

import { DocumentSnapshot } from 'firebase/firestore';

export const getVolunteers = async (
  name?: string,
  lastVolunteer?: DocumentSnapshot | null,
  pageSize = 10,
): Promise<GetVolunteersResult> => {
  const queryArgs: QueryArgs[] = [orderBy('firstName', 'desc'), limit(pageSize)];

  if (lastVolunteer) {
    queryArgs.push(startAfter(lastVolunteer));
  }

  const queryForVolunteers = query(collection(firebaseDb, FirebaseCollection.Volunteers), ...queryArgs);

  try {
    const querySnapshot = await getDocs(queryForVolunteers);
    const volunteers = querySnapshot.docs.map(doc => doc.data() as IVolunteer);

    if (name) {
      const filteredVolunteers = volunteers.filter(
        volunteer =>
          volunteer.firstName.toLowerCase().includes(name.toLowerCase()) ||
          volunteer.lastName.toLowerCase().includes(name.toLowerCase()),
      );

      return {
        volunteers: filteredVolunteers,
        lastVolunteer: filteredVolunteers.length ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
      };
    }

    return {
      volunteers,
      lastVolunteer: volunteers.length ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
    };
  } catch (e) {
    console.error('Could not retrieve volunteers data', e);
    return { volunteers: [], lastVolunteer: null };
  }
};
