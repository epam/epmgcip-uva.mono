import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IUser } from 'src/types';

export const getAllUsers = async (): Promise<IUser[]> => {
  const queryForUsers = query(
    collection(firebaseDb, 'users'),
    orderBy('createdAt', 'desc'),
  );
  
  const querySnapshot = await getDocs(queryForUsers);
  const allUsers: IUser[] = [];

  querySnapshot.forEach((record) => {
    allUsers.push(record.data() as IUser);
  });

  return allUsers;
};
