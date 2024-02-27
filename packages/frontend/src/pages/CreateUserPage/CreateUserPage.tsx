import { useEffect, useState } from 'react';
import { Button, Input, Loader, Select } from 'src/components';
import css from './CreateUserPage.module.sass';
import { IState, IUser, IValidationError, UserRole, UserStatus } from 'src/types';
import { MANAGE_USERS_ROUTE, USER_ROLES, USER_STATUSES } from 'src/constants';
import { useNavigate } from 'react-router-dom';
import { createUser, validateValues } from 'src/utils';
import { useDispatch, useSelector } from 'react-redux';
import translation from 'src/translations/Russian.json';
import { v4 as uuidv4 } from 'uuid';
import { Dispatch } from '@reduxjs/toolkit';
import { addUsersToList } from 'src/redux/actions';

export const CreateUserPage = () => {
  const navigate = useNavigate();
  const dispatch: Dispatch = useDispatch();
  const editorName = useSelector((state: IState) => state.editor.name);

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [telegramName, setTelegramName] = useState<string>('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<UserStatus>(UserStatus.Active);
  const [validationErrors, setValidationErrors] = useState<IValidationError>({});
  const [isStartSubmitting, setIsStartSubmitting] = useState(false);

  const handleCreateUser = () => {
    navigate(MANAGE_USERS_ROUTE);
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsStartSubmitting(() => true);

    if (Object.keys(validationErrors).length === 0) {
      const currentDate = new Date().toString();
      const newUser: IUser = {
        name,
        telegramName,
        role: role as UserRole,
        status,
        id: uuidv4(),
        createdAt: currentDate,
        createdBy: editorName,
      };

      setIsCreating(() => true);

      createUser(newUser).then((result) => {
        if (result) {
          dispatch(addUsersToList([newUser]));
        }
        handleCreateUser();
      });
    }
  };

  useEffect(() => {
    if (telegramName.length > 0 && !telegramName.startsWith('@')) {
      setTelegramName((previousValue) => `@${previousValue}`);
    }

    setValidationErrors(
      validateValues({
        name,
        telegramName,
        role,
        status,
      })
    );
  }, [name, role, status, telegramName]);

  return (
    <div className={css.createUserWrapper}>
      <div className={css.createUserTitle}>{translation.addUser}</div>
      <form className={css.createUserForm} onSubmit={handleSubmit}>
        <Input
          value={name}
          setChange={setName}
          labelText={translation.name}
          required
          isValidationError={isStartSubmitting && !!validationErrors.name}
          errorMessage={validationErrors.name}
        />
        <Input
          value={telegramName}
          setChange={setTelegramName}
          labelText={translation.telegramName}
          required
          isValidationError={
            isStartSubmitting && !!validationErrors.telegramName
          }
          errorMessage={validationErrors.telegramName}
        />
        <Select
          value={role}
          setChange={setRole}
          options={USER_ROLES}
          labelText={translation.role}
          required
          placeholder={translation.choice}
          selectClassName={!role ? css.selectPlaceholder : undefined}
          isValidationError={isStartSubmitting && !!validationErrors.role}
          errorMessage={validationErrors.role}
        />
        <Select
          value={status}
          setChange={setStatus}
          options={USER_STATUSES}
          labelText={translation.status}
          required
        />
        <div className={css.buttonsPanel}>
          <Button
            onClick={handleCreateUser}
            className={`${css.createUserButton} ${css.backButton}`}
          >
            {translation.back}
          </Button>
          <Button
            onClick={() => null}
            className={`${css.createUserButton} ${css.submitButton}`}
            id='create-user-submit'
            disabled={isCreating}
          >
            {isCreating ? <Loader size={'12px'} /> : translation.add}
          </Button>
        </div>
      </form>
    </div>
  );
};
