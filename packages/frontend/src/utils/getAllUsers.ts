import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IUser } from 'src/types';
import { editUser } from './editUser';
import { getUserDocId } from './getUser';
import { FirebaseCollection } from 'src/constants';

/** Get all users.
 *  If id is not is lowercase for some users, re-saves it with correct id.
 *  If field telegramNameLowCase is missing for some users, adds it
 */
export const getAllUsers = async (): Promise<IUser[]> => {
  const queryForUsers = query(collection(firebaseDb, FirebaseCollection.Users), orderBy('createdAt', 'desc'));

  const querySnapshot = await getDocs(queryForUsers);
  const allUsers: IUser[] = [];

  querySnapshot.forEach(record => {
    const user = record.data() as IUser;
    allUsers.push(user);

    if (record.id !== getUserDocId(user.telegramName) && user.telegramNameLowCase === undefined) {
      editUser(
        user.telegramName,
        {
          telegramName: user.telegramName,
          telegramNameLowCase: user.telegramName.toLowerCase(),
        },
        false
      );
    } else if (user.telegramNameLowCase === undefined) {
      editUser(
        user.telegramName,
        {
          telegramNameLowCase: user.telegramName.toLowerCase(),
        },
        false
      );
    }
  });

  return allUsers;
};
