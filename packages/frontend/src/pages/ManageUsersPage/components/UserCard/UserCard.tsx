import { Button, Dot } from 'src/components';
import css from './UserCard.module.sass';
import { IUser } from 'src/types';
import EditSvg from 'src/assets/pencil.svg';
import { useNavigate } from 'react-router-dom';
import translation from 'src/translations/Russian.json';

interface UserCardProps extends IUser {}

const maxNameLength = 38;
const maxTelegramNameLength = 10;

export const UserCard = ({
  name,
  telegramName,
  role,
  status,
}: UserCardProps) => {
  const navigate = useNavigate();
  const isLongName = name.split(' ').some((namePart) => namePart.length > maxNameLength);
  const isLongTelegramName = telegramName.length > maxTelegramNameLength;

  const handleEditUser = () => {
    navigate(`/users/edit/${telegramName}`);
  };

  return (
    <div className={css.userCardWrapper}>
      <div className={css.userContainer}>
        <div className={css.userName}>
          {isLongName ? `${name.slice(0, maxNameLength)}...` : name}
        </div>
        <div className={css.userInfo}>
          <div>
            {isLongTelegramName
              ? `${telegramName.slice(0, maxTelegramNameLength)}...`
              : telegramName}
          </div>
          <Dot />
          <div>{translation[role]}</div>
          <Dot />
          <div>{translation[status]}</div>
        </div>
      </div>
      <Button onClick={handleEditUser} className={css.userEditButton}>
        <img className={css.headerLogo} src={EditSvg} alt='User Edit Button' />
      </Button>
    </div>
  );
};
