import css from './UsersBlock.module.sass';
import { IUser } from 'src/types';
import { UserCard } from '../UserCard/UserCard';
import LogoSvg from 'src/assets/logo.svg';
import SearchSvg from 'src/assets/loupe.svg';
import translation from 'src/translations/Russian.json';

interface UsersBlockProps {
  users: IUser[];
  isSearch: boolean;
}

export const UsersBlock = ({ users, isSearch }: UsersBlockProps) => {
  if (isSearch && users.length === 0) {
    return (
      <div className={css.usersBlockWrapper}>
        {isSearch ? (
          <>
            <img className={css.usersBlockLogo} src={SearchSvg} />
            <div className={css.emptyMessage}>{translation.usersNotFound}</div>
          </>
        ) : (
          <>
            <img className={css.usersBlockLogo} src={LogoSvg} />
            <div className={css.emptyMessage}>{translation.emptyUsersList}</div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={css.usersBlockWrapper}>
      {users.map((user) => (
        <UserCard key={user.id} {...user} />
      ))}
    </div>
  );
};
