import { FirebaseCollection } from 'uva-shared';
import { firebaseDb } from 'src/main';
import { IVolunteer } from 'uva-shared/src/types/volunteer';
import { collection, getDocs, limit, orderBy, query, startAfter, where, DocumentSnapshot } from 'firebase/firestore';
import { QueryArgs } from './getEvents';

export interface GetVolunteersResult {
  readonly volunteers: IVolunteer[];
  readonly lastVolunteer: DocumentSnapshot | null;
}

const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split('-');
  return `${day}-${month}-${year}`;
};

export const getVolunteers = async (
  name?: string,
  languages: string[] = [],
  volunteerAgeFrom = '',
  volunteerAgeTo = '',
  gender = '',
  // After adding ability of blocking volunteer, open this block
  // showBlocked = false,
  lastVolunteer?: DocumentSnapshot | null,
  pageSize = 20,
): Promise<GetVolunteersResult> => {
  const queryArgs: QueryArgs[] = [];
  const formattedAgeFrom = formatDateToDDMMYYYY(volunteerAgeFrom);
  const formattedAgeTo = formatDateToDDMMYYYY(volunteerAgeTo);

  if (gender) {
    queryArgs.push(where('gender', '==', gender));
  }

  // After adding ability of blocking volunteer, open this block
  // if (showBlocked) {
  //   queryArgs.push(where('isBlocked', '==', true));
  // }

  if (volunteerAgeFrom && volunteerAgeTo) {
    queryArgs.push(where('birthDate', '<=', formattedAgeTo), where('birthDate', '>=', formattedAgeFrom));
  } else if (volunteerAgeFrom) {
    queryArgs.push(where('birthDate', '>=', formattedAgeFrom));
  } else if (volunteerAgeTo) {
    queryArgs.push(where('birthDate', '<=', formattedAgeTo));
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

    const volunteers = [
      ...firstNameResult.docs.map(doc => doc.data() as IVolunteer),
      ...lastNameResult.docs.map(doc => doc.data() as IVolunteer),
    ];

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
