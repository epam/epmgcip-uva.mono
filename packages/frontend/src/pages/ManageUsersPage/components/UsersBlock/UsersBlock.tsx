import css from './UsersBlock.module.sass';
import { IUser } from 'src/types';
import { UserCard } from '../UserCard/UserCard';

interface UsersBlockProps {
  users: IUser[];
}

export const UsersBlock = ({ users }: UsersBlockProps) => {
  return (
    <div className={css.usersBlockWrapper}>
      {users.map((user) => (
        <UserCard key={user.id} {...user} />
      ))}
    </div>
  );
};
