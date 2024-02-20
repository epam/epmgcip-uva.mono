import { useEffect, useState } from 'react';
import { Button, Input, Loader, Modal, Select } from 'src/components';
import css from './EditUserPage.module.sass';
import { IState, IUser, UserStatus } from 'src/types';
import { DELETE_USER_QUESTION, MANAGE_USERS_ROUTE, USER_ROLES, USER_STATUSES } from 'src/constants';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteUser, editUser } from 'src/utils';
import { useDispatch, useSelector } from 'react-redux';
import translation from 'src/translations/Russian.json';
import { Dispatch } from '@reduxjs/toolkit';
import { updateUsersList } from 'src/redux/actions';

export const EditUserPage = () => {
  const navigate = useNavigate();
  const dispatch: Dispatch = useDispatch();
  const { telegramName: userTelegramName } = useParams();
  const usersList = useSelector((state: IState) => state.usersList);
  const editableUser = usersList.find(
    (user) => user.telegramName === userTelegramName
  ) as IUser;
  const undatedUserIndex = usersList.findIndex(
    (user) => user.telegramName === userTelegramName
  );

  const {
    name: editableName,
    telegramName: editableTelegramName,
    role: editableRole,
    status: editableStatus,
  } = editableUser;

  const editorName = useSelector((state: IState) => state.editor.name);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(editableName);
  const [telegramName, setTelegramName] =
    useState<string>(editableTelegramName);
  const [role, setRole] = useState(editableRole);
  const [status, setStatus] = useState<UserStatus>(editableStatus);
  const [isDelete, setIsDelete] = useState(false);

  const handleUpdateUser = () => {
    navigate(MANAGE_USERS_ROUTE);
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();

    const currentDate = new Date().toString();
    const updatedFields: Partial<IUser> = {
      ...(name !== editableName && { name }),
      ...(telegramName !== editableTelegramName && { telegramName }),
      ...(role !== editableRole && { role }),
      ...(status !== editableStatus && { status }),
      updatedAt: currentDate,
      updatedBy: editorName,
    };

    setIsSaving(() => true);

    editUser(editableTelegramName, editableName, updatedFields).then(
      (result) => {
        if (result) {
          const updatedUser: IUser = { ...editableUser, ...updatedFields };
          const updatedUsersList: IUser[] = [...usersList];
          updatedUsersList[undatedUserIndex] = { ...updatedUser };

          dispatch(updateUsersList(updatedUsersList));
        }
        setIsSaving(() => true);
        handleUpdateUser();
      }
    );
  };

  const handleDelete = () =>
    setIsDelete((previousValue) => !previousValue);

  const handleDeleteUser = () => {
    const updatedUsersList: IUser[] = [...usersList];
    updatedUsersList.splice(undatedUserIndex, 1);

    dispatch(updateUsersList(updatedUsersList));
    deleteUser(editableTelegramName, editableName);
    setIsSaving(() => true);
    handleUpdateUser();
  };

  useEffect(() => {
    if (telegramName.length > 0 && !telegramName.startsWith('@')) {
      setTelegramName((previousValue) => `@${previousValue}`);
    }

    if (
      name !== editableName ||
      telegramName !== editableTelegramName ||
      role !== editableRole ||
      status !== editableStatus
    ) {
      setIsEditing(() => true);
    } else {
      setIsEditing(() => false);
    }
  }, [
    editableName,
    editableRole,
    editableStatus,
    editableTelegramName,
    name,
    role,
    status,
    telegramName,
  ]);

  return (
    <div className={css.editUserWrapper}>
      <div className={css.editUserTitle}>{translation.editUser}</div>
      <Button className={css.deleteUserButton} onClick={handleDelete}>
        Удалить
      </Button>
      {isDelete && (
        <Modal
          cancelButtonMessage={translation.back}
          submitButtonMessage={translation.delete}
          isLoading={isSaving}
          handleClose={handleDelete}
          handleSubmit={handleDeleteUser}
          message={DELETE_USER_QUESTION(editableName)}
        />
      )}
      <form className={css.editUserForm} onSubmit={handleSubmit}>
        <Input
          value={name}
          setChange={setName}
          labelText={translation.name}
          required
          minLength={2}
          maxLength={256}
        />
        <Input
          value={telegramName}
          setChange={setTelegramName}
          labelText={translation.telegramName}
          required
          minLength={5}
          maxLength={32}
        />
        <Select
          value={role}
          setChange={setRole}
          options={USER_ROLES}
          labelText={translation.role}
          required
          placeholder={translation.choice}
          selectClassName={!role ? css.selectPlaceholder : undefined}
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
            onClick={handleUpdateUser}
            className={`${css.editUserButton} ${css.backButton}`}
          >
            {translation.back}
          </Button>
          <Button
            onClick={() => null}
            className={`${css.editUserButton} ${css.submitButton}`}
            id='save-user-submit'
            disabled={isSaving || !isEditing}
          >
            {isSaving ? <Loader size={'12px'} /> : translation.save}
          </Button>
        </div>
      </form>
    </div>
  );
};
