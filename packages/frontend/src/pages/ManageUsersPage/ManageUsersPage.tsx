import css from './ManageUsersPage.module.sass';
import { Button, Input, Loader } from 'src/components';
import { useNavigate } from 'react-router-dom';
import { CREATE_USER_ROUTE, EVENTS_ROUTE, ROOT_ROUTE } from 'src/constants';
import { IState, UserRole } from 'src/types';
import { useEffect, useState } from 'react';
import translation from 'src/translations/Russian.json';
import { useDispatch, useSelector } from 'react-redux';
import { UsersBlock } from './components/UsersBlock/UsersBlock';
import { Dispatch } from '@reduxjs/toolkit';
import { addUsersToList } from 'src/redux/actions';
import { getAllUsers } from 'src/utils/getAllUsers';
import { getSearch } from 'src/utils/getSearch';

export const ManageUsersPage = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUsersList = useSelector((state: IState) => state.usersList);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);
  const editor = useSelector((state: IState) => state.editor);
  const [isLoading, setIsLoading] = useState(currentUsersList.length === 0);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(() => true) : navigate(ROOT_ROUTE);

    if (editor.role === UserRole.Coordinator) {
      navigate(EVENTS_ROUTE);
    }

    if (isLoading) {
      getAllUsers().then((result) => {
        setIsLoading(false);
        dispatch(addUsersToList(result));
      });
    }
  }, [dispatch, editor, isLoading, navigate]);

  const handleCreateUser = () => {
    navigate(CREATE_USER_ROUTE);
  };

  return (
    isEditorHasPermissions &&
    editor.role === UserRole.Admin && (
      <div className={css.manageUsersWrapper}>
        <div className={css.manageUsersTitleWrapper}>
          <div className={css.manageUsersTitle}>{translation.users}</div>
          <Button className={css.addUserButton} onClick={handleCreateUser}>
            {translation.add}
          </Button>
        </div>
        <Input
          value={searchInput}
          setChange={setSearchInput}
          placeholder={translation.userSearchPlaceholder}
          labelClassName={css.manageUsersSearchLabel}
          inputClassName={css.manageUsersSearchInput}
        />
        {isLoading ? (
          <Loader className={css.manageUsersLoader} />
        ) : (
          <UsersBlock
            users={getSearch(currentUsersList, searchInput)}
            isSearch={!!searchInput}
          />
        )}
      </div>
    )
  );
};
