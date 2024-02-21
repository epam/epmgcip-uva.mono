import { IUser } from 'src/types';
import { ADD_USERS_TO_LIST, SET_SHOW_MENU, SET_EDITOR_NAME, UPDATE_USERS_LIST } from './types';

export const setEditorName = (name: string) => ({
  type: SET_EDITOR_NAME,
  payload: name,
});

export const setMenu = (menuState: boolean) => ({
  type: SET_SHOW_MENU,
  payload: menuState,
});

export const addUsersToList = (users: IUser[]) => ({
  type: ADD_USERS_TO_LIST,
  payload: users,
});

export const updateUsersList = (users: IUser[]) => ({
  type: UPDATE_USERS_LIST,
  payload: users,
});

