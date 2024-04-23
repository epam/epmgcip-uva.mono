import { Dispatch } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Input, Loader } from 'src/components';
import { Toolbar } from 'src/components/Toolbar/Toolbar';
import { CREATE_USER_ROUTE, EVENTS_ROUTE, ROOT_ROUTE } from 'src/constants';
import {
  addUsersToList,
  setManageUsersScrollDirection,
  setManageUsersScrollSize,
  setManageUsersSearchInput,
} from 'src/redux/actions';
import translation from 'src/translations/Russian.json';
import { IState, ScrollDirection, UserRole } from 'src/types';
import { getAllUsers } from 'src/utils/getAllUsers';
import { getSearch } from 'src/utils/getSearch';
import css from './ManageUsersPage.module.sass';
import { UsersBlock } from './components/UsersBlock/UsersBlock';
import { PageWrapper } from 'src/components/PageWrapper/PageWrapper';

const minScrollSize = 75;

const handleScrollDirection = (
  scrollSize: number,
  setScrollDirection: React.Dispatch<React.SetStateAction<ScrollDirection>>,
  setScrollSize: React.Dispatch<React.SetStateAction<number>>
) => {
  if (scrollSize !== window.scrollY && Math.abs(window.scrollY - scrollSize) > minScrollSize) {
    window.scrollY > scrollSize
      ? setScrollDirection(ScrollDirection.Up)
      : setScrollDirection(ScrollDirection.Down);

    setScrollSize(window.scrollY);
  }
};

export const ManageUsersPage = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUsersList = useSelector((state: IState) => state.usersList);
  const editor = useSelector((state: IState) => state.editor);
  const searchInput = useSelector((state: IState) => state.manageUsersPage.userSearchInput);
  const setSearchInput = (inputString: string) => dispatch(setManageUsersSearchInput(inputString));
  const savedScrollSize = useSelector((state: IState) => state.manageUsersPage.scrollSize);
  const savedScrollDirection = useSelector(
    (state: IState) => state.manageUsersPage.scrollDirection
  );

  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);
  const [isLoading, setIsLoading] = useState(currentUsersList.length === 0);
  const [scrollSize, setScrollSize] = useState(savedScrollSize);
  const [scrollDirection, setScrollDirection] = useState(savedScrollDirection);
  const [isShowTitleWrapper, setIsShowTitleWrapper] = useState(true);

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(() => true) : navigate(ROOT_ROUTE);

    if (editor.role === UserRole.Coordinator) {
      navigate(EVENTS_ROUTE);
    }

    if (isLoading) {
      getAllUsers().then(result => {
        setIsLoading(false);
        dispatch(addUsersToList(result));
      });
    }
  }, [dispatch, editor, isLoading, navigate]);

  useEffect(() => {
    setTimeout(() => window.scrollTo(0, savedScrollSize), 0);
  }, []);

  const handleCreateUser = () => {
    navigate(CREATE_USER_ROUTE);
  };

  useEffect(() => {
    setIsShowTitleWrapper(() => scrollDirection === ScrollDirection.Down);

    addEventListener('scroll', () =>
      handleScrollDirection(scrollSize, setScrollDirection, setScrollSize)
    );

    return () => {
      dispatch(setManageUsersScrollSize(scrollSize));
      dispatch(setManageUsersScrollDirection(scrollDirection));
      removeEventListener('scroll', () =>
        handleScrollDirection(scrollSize, setScrollDirection, setScrollSize)
      );
    };
  }, [dispatch, scrollDirection, scrollSize]);

  if (!isEditorHasPermissions || editor.role !== UserRole.Admin) {
    return null;
  }

  return (
    <PageWrapper
      toolbar={
        <>
          {isShowTitleWrapper && (
            <Toolbar
              title={translation.users}
              buttonText={translation.add}
              onClick={handleCreateUser}
            />
          )}
          <Input
            value={searchInput}
            setChange={setSearchInput}
            type="search"
            placeholder={translation.userSearchPlaceholder}
            labelClassName={css.manageUsersSearchLabel}
            inputClassName={css.manageUsersSearchInput}
          />
        </>
      }
      page={
        isLoading ? (
          <Loader className={css.manageUsersLoader} />
        ) : (
          <UsersBlock users={getSearch(currentUsersList, searchInput)} isSearch={!!searchInput} />
        )
      }
    />
  );
};
