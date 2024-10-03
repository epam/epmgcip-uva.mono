import { FirebaseCollection } from 'uva-shared';
import { firebaseDb } from 'src/main';
import { IVolunteer } from 'uva-shared/src/types/volunteer';
import { collection, getDocs, limit, orderBy, query, startAfter, where, DocumentSnapshot } from 'firebase/firestore';
import { QueryArgs } from './getEvents';

export interface GetVolunteersResult {
  readonly volunteers: IVolunteer[];
  readonly lastVolunteer: DocumentSnapshot | null;
}

export const getVolunteers = async (
  name?: string,
  languages: string[] = [],
  volunteerMinAge = 16,
  volunteerMaxAge = 61,
  gender = '',
  // After adding ability of blocking volunteer, open this block
  // showBlocked = false,
  lastVolunteer?: DocumentSnapshot | null,
  pageSize = 20,
): Promise<GetVolunteersResult> => {
  const queryArgs: QueryArgs[] = [];

  if (gender) {
    queryArgs.push(where('gender', '==', gender));
  }

  // After adding ability of blocking volunteer, open this block
  // if (showBlocked) {
  //   queryArgs.push(where('isBlocked', '==', true));
  // }

  if (volunteerMinAge) {
    queryArgs.push(where('age', '>=', volunteerMinAge));
  }

  if (volunteerMaxAge) {
    queryArgs.push(where('age', '<=', volunteerMaxAge));
  }

  if (languages.length > 0) {
    queryArgs.push(where('language', 'array-contains-any', languages));
  }

  if (lastVolunteer) {
    queryArgs.push(startAfter(lastVolunteer));
  }

  let queryForVolunteers;
  if (name) {
    const start = name.toLowerCase();
    const end = start + '\uf8ff';

    queryForVolunteers = query(
      collection(firebaseDb, FirebaseCollection.Volunteers),
      where('firstName', '>=', start),
      where('firstName', '<', end),
      ...queryArgs,
      orderBy('firstName', 'asc'),
      limit(pageSize),
    );

    const lastNameQuery = query(
      collection(firebaseDb, FirebaseCollection.Volunteers),
      where('lastName', '>=', start),
      where('lastName', '<', end),
      ...queryArgs,
      orderBy('lastName', 'asc'),
      limit(pageSize),
    );

    const firstNameResult = await getDocs(queryForVolunteers);
    const lastNameResult = await getDocs(lastNameQuery);

    // Use a Map to filter out duplicates by document ID
    const uniqueVolunteers = new Map<string, IVolunteer>();

    firstNameResult.docs.forEach(doc => uniqueVolunteers.set(doc.id, doc.data() as IVolunteer));
    lastNameResult.docs.forEach(doc => uniqueVolunteers.set(doc.id, doc.data() as IVolunteer));

    const volunteers = Array.from(uniqueVolunteers.values());

    return {
      volunteers,
      lastVolunteer: volunteers.length ? firstNameResult.docs[firstNameResult.docs.length - 1] : null,
    };
  } else {
    queryForVolunteers = query(
      collection(firebaseDb, FirebaseCollection.Volunteers),
      ...queryArgs,
      orderBy('firstName', 'asc'),
      limit(pageSize),
    );
  }

  try {
    const querySnapshot = await getDocs(queryForVolunteers);
    const volunteers = querySnapshot.docs.map(doc => doc.data() as IVolunteer);

    return {
      volunteers,
      lastVolunteer: volunteers.length ? querySnapshot.docs[querySnapshot.docs.length - 1] : null,
    };
  } catch (e) {
    console.error('Error querying volunteers:', e);
    return { volunteers: [], lastVolunteer: null };
  }
};
