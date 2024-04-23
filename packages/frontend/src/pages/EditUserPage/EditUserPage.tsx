import { Dispatch } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Loader, Modal, Select } from 'src/components';
import {
  DELETE_USER_QUESTION,
  EMPTY_USER,
  EVENTS_ROUTE,
  MANAGE_USERS_ROUTE,
  ROOT_ROUTE,
  USER_ROLES,
  USER_STATUSES,
} from 'src/constants';
import { updateUsersList } from 'src/redux/actions';
import translation from 'src/translations/Russian.json';
import {
  IState,
  IUser,
  IValidationError,
  UserRole,
  UserStatus,
} from 'src/types';
import { deleteUser } from 'src/utils/deleteUser';
import { editUser } from 'src/utils/editUser';
import { validateUserValues } from 'src/utils/validateUserValues';
import css from './EditUserPage.module.sass';

export const EditUserPage = () => {
  const navigate = useNavigate();
  const dispatch: Dispatch = useDispatch();
  const editor = useSelector((state: IState) => state.editor);
  const { telegramName: userTelegramName } = useParams();
  const usersList = useSelector((state: IState) => state.usersList);
  const editableUser =
    usersList.find((user) => user.telegramName === userTelegramName) ||
    EMPTY_USER;
  const updatedUserIndex = usersList.findIndex(
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
  const [validationErrors, setValidationErrors] = useState<IValidationError>(
    {}
  );
  const [isStartEditing, setIsStartEditing] = useState(false);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);

  const handleUpdateUser = () => {
    navigate(MANAGE_USERS_ROUTE);
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsStartEditing(() => true);

    if (Object.keys(validationErrors).length === 0) {
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

      editUser(editableTelegramName, updatedFields).then((result) => {
        if (result) {
          const updatedUser: IUser = {
             ...editableUser, 
             ...updatedFields, 
             telegramNameLowCase: updatedFields.telegramName ?
                                  updatedFields.telegramName.toLowerCase() :
                                  editableUser.telegramName.toLowerCase() 
            };
          const updatedUsersList: IUser[] = [...usersList];
          updatedUsersList[updatedUserIndex] = { ...updatedUser };

          dispatch(updateUsersList(updatedUsersList));
        }

        handleUpdateUser();
      });
    }
  };

  const switchDeleteModal = () =>
    setIsDelete((previousValue) => !previousValue);

  const handleDeleteUser = () => {
    const updatedUsersList: IUser[] = [...usersList];
    updatedUsersList.splice(updatedUserIndex, 1);

    dispatch(updateUsersList(updatedUsersList));
    setIsSaving(() => true);
    deleteUser(editableTelegramName);
    handleUpdateUser();
  };

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(true) : navigate(ROOT_ROUTE);

    if (editor.role === UserRole.Coordinator) {
      navigate(EVENTS_ROUTE);
    }

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

    setValidationErrors(
      validateUserValues({
        name,
        telegramName,
        role,
        status,
      })
    );
  }, [
    editableName,
    editableRole,
    editableStatus,
    editableTelegramName,
    editor,
    name,
    navigate,
    role,
    status,
    telegramName,
  ]);

  return (
    isEditorHasPermissions &&
    editor.role === UserRole.Admin && (
      <div className={css.editUserWrapper}>
        <div className={css.editUserTitle}>{translation.editUser}</div>
        {editor.telegramName !== userTelegramName && (
          <Button className={css.deleteUserButton} onClick={switchDeleteModal}>
            {translation.delete}
          </Button>
        )}
        {isDelete && (
          <Modal
            cancelButtonMessage={translation.back}
            submitButtonMessage={translation.delete}
            isLoading={isSaving}
            handleClose={switchDeleteModal}
            handleSubmit={handleDeleteUser}
            message={DELETE_USER_QUESTION(editableName)}
            submitClassName={css.modalUserDeleteButton}
            cancelClassName={css.modalCancelButton}
          />
        )}
        <form className={css.editUserForm} onSubmit={handleSubmit}>
          <Input
            value={name}
            setChange={setName}
            labelText={translation.name}
            required
            isValidationError={isStartEditing && !!validationErrors.name}
            errorMessage={validationErrors.name}
          />
          <Input
            value={telegramName}
            setChange={setTelegramName}
            labelText={translation.telegramName}
            required
            isValidationError={
              isStartEditing && !!validationErrors.telegramName
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
            isValidationError={isStartEditing && !!validationErrors.role}
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
              onClick={handleUpdateUser}
              className={`${css.editUserButton} ${css.backButton}`}
            >
              {translation.back}
            </Button>
            <Button
              className={`${css.editUserButton} ${css.submitButton}`}
              id='update-user-submit'
              disabled={isSaving || !isEditing}
            >
              {isSaving ? <Loader size={'12px'} /> : translation.save}
            </Button>
          </div>
        </form>
      </div>
    )
  );
};
