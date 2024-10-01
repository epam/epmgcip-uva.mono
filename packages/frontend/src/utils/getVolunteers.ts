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
  lastVolunteer?: DocumentSnapshot | null,
  pageSize = 20,
): Promise<GetVolunteersResult> => {
  let volunteers: IVolunteer[] = [];
  let querySnapshot;
  
  const searchByField = async (field: 'firstName' | 'lastName') => {
    const queryArgs: QueryArgs[] = [orderBy(field, 'asc'), limit(pageSize)];

    if (name) {
      const start = name.toLowerCase();
      const end = start + '\uf8ff';
      queryArgs.unshift(where(field, '>=', start), where(field, '<', end));
    }

    if (lastVolunteer) {
      queryArgs.push(startAfter(lastVolunteer));
    }

    const queryForVolunteers = query(collection(firebaseDb, FirebaseCollection.Volunteers), ...queryArgs);
    return await getDocs(queryForVolunteers);
  };

  try {
    querySnapshot = await searchByField('firstName');
    volunteers = querySnapshot.docs.map(doc => doc.data() as IVolunteer);
    
    if (volunteers.length === 0 && name) {
      console.log('No results by firstName, searching by lastName...');
      querySnapshot = await searchByField('lastName');
      volunteers = querySnapshot.docs.map(doc => doc.data() as IVolunteer);
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
