import css from './ManageUsersPage.module.sass';
import { Button } from 'src/components';
import { useNavigate } from 'react-router-dom';
import { CREATE_USER_ROUTE } from 'src/constants';

export const ManageUsersPage = () => {
  const navigate = useNavigate();

  const handleCreateUser = () => {
    navigate(CREATE_USER_ROUTE);
  };

  return (
    <div className={css.manageUsersWrapper}>
      <Button className={css.addUserButton} onClick={handleCreateUser}>+ Add user</Button>
    </div>
  );
};
