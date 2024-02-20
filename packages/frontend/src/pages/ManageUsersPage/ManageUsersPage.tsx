import css from './ManageUsersPage.module.sass';
import { Button, Input, Loader } from 'src/components';
import { useNavigate } from 'react-router-dom';
import { CREATE_USER_ROUTE } from 'src/constants';
import { getAllUsers } from 'src/utils';
import { IState } from 'src/types';
import { useEffect, useState } from 'react';
import translation from 'src/translations/Russian.json';
import { useDispatch, useSelector } from 'react-redux';
import { UsersBlock } from './components/UsersBlock/UsersBlock';
import { Dispatch } from '@reduxjs/toolkit';
import { addUsersToList } from 'src/redux/actions';

export const ManageUsersPage = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUsersList = useSelector((state: IState) => state.usersList);
  const [isLoading, setIsLoading] = useState(currentUsersList.length === 0);
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    if (isLoading) {
      getAllUsers().then((result) => {
        setIsLoading(false);
        dispatch(addUsersToList(result));
      });
    }
  }, [dispatch, isLoading]);

  const handleCreateUser = () => {
    navigate(CREATE_USER_ROUTE);
  };

  return (
    <div className={css.manageUsersWrapper}>
      <div className={css.manageUsersTitleWrapper}>
        <div className={css.manageUsersTitle}>{translation.usersList}</div>
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
        <UsersBlock users={currentUsersList} />
      )}
    </div>
  );
};
