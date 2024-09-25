import { FirebaseCollection } from 'uva-shared';
import { firebaseDb } from 'src/main';
import { IVolunteer } from 'uva-shared/src/types/volunteer';
import {
  collection,
  getDocs,
} from 'firebase/firestore';

export const getVolunteers = async (name?: string): Promise<IVolunteer[]> => {
  try {
    const volunteersSnapshot = await getDocs(collection(firebaseDb, FirebaseCollection.Volunteers));
    const allVolunteers: IVolunteer[] = volunteersSnapshot.docs.map(doc => doc.data() as IVolunteer);

    if (name) {
      const filteredVolunteers = allVolunteers.filter(volunteer => 
        volunteer.firstName.toLowerCase().includes(name.toLowerCase()) ||
        volunteer.lastName.toLowerCase().includes(name.toLowerCase())
      );
      return filteredVolunteers;
    }

    return allVolunteers;
  } catch (e) {
    console.error('Could not retrieve volunteers data', e);
    return [];
  }
};
