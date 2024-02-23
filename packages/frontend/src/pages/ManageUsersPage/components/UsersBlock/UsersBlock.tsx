import css from './UsersBlock.module.sass';
import { IUser } from 'src/types';
import { UserCard } from '../UserCard/UserCard';
import LogoSvg from 'src/assets/logo.svg';
import translation from 'src/translations/Russian.json';

interface UsersBlockProps {
  users: IUser[];
}

export const UsersBlock = ({ users }: UsersBlockProps) => {
  return (
    <div className={css.usersBlockWrapper}>
      {users.length !== 0 ? (
        users.map((user) => <UserCard key={user.id} {...user} />)
      ) : (
        <>
          <img className={css.usersBlockLogo} src={LogoSvg} />
          <div className={css.emptyMessage}>{translation.emptyUsersList}</div>
        </>
      )}
    </div>
  );
};
