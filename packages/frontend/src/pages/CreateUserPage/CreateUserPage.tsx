import { useEffect, useState } from 'react';
import { Button, Input, Loader, Select } from 'src/components';
import css from './CreateUserPage.module.sass';
import { IState, UserRole, UserStatus } from 'src/types';
import { MANAGE_USERS_ROUTE, USER_ROLES, USER_STATUSES } from 'src/constants';
import { useNavigate } from 'react-router-dom';
import { createUser } from 'src/utils';
import { useSelector } from 'react-redux';

export const CreateUserPage = () => {
  const navigate = useNavigate();
  const userName = useSelector((state: IState) => state.userName);

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [telegramName, setTelegramName] = useState<string>('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<UserStatus>(UserStatus.Active);

  const handleCreateUser = () => {
    navigate(MANAGE_USERS_ROUTE);
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    setIsCreating(() => true);

    createUser(
      { name, telegramName, role: role as UserRole, status },
      userName
    ).then(() => {
      setIsCreating(() => true);
      handleCreateUser();
    });
  };

  useEffect(() => {
    if (telegramName.length > 0 && !telegramName.startsWith('@')) {
      setTelegramName((previousValue) => `@${previousValue}`);
    }
  }, [telegramName]);

  return (
    <div className={css.createUserWrapper}>
      <div className={css.createUserTitle}>Добавить пользователя</div>
      <form className={css.createUserForm} onSubmit={handleSubmit}>
        <Input
          value={name}
          setChange={setName}
          labelText='Имя'
          required
          minLength={2}
          maxLength={256}
        />
        <Input
          value={telegramName}
          setChange={setTelegramName}
          labelText='Имя в Telegram'
          required
          minLength={5}
          maxLength={32}
        />
        <Select
          value={role}
          setChange={setRole}
          options={USER_ROLES}
          labelText='Роль'
          required
          placeholder='Выбор'
          selectClassName={!role ? css.selectPlaceholder : undefined}
        />
        <Select
          value={status}
          setChange={setStatus}
          options={USER_STATUSES}
          labelText='Статус'
          required
        />
        <div className={css.buttonsPanel}>
          <Button
            onClick={handleCreateUser}
            className={`${css.createUserButton} ${css.backButton}`}
          >
            Назад
          </Button>
          <Button
            onClick={() => null}
            className={`${css.createUserButton} ${css.submitButton}`}
            id='create-user-submit'
            disabled={isCreating}
          >
            {isCreating ? <Loader size={'12px'} /> : 'Добавить'}
          </Button>
        </div>
      </form>
    </div>
  );
};
