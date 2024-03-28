import { IEvent, IUser, ScrollDirection } from 'src/types';
import {
  ADD_USERS_TO_LIST,
  SET_SHOW_MENU,
  SET_EDITOR,
  UPDATE_USERS_LIST,
  SET_USER_SEARCH_INPUT,
  SET_MANAGE_USERS_SCROLL_SIZE,
  SET_MANAGE_USERS_SCROLL_DIRECTION,
  ADD_EVENTS_TO_LIST,
} from './types';

export const setEditor = (editor: IUser) => ({
  type: SET_EDITOR,
  payload: editor,
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

export const setManageUsersSearchInput = (searchInput: string) => ({
  type: SET_USER_SEARCH_INPUT,
  payload: searchInput,
});

export const setManageUsersScrollSize = (scrollSize: number) => ({
  type: SET_MANAGE_USERS_SCROLL_SIZE,
  payload: scrollSize,
})

export const setManageUsersScrollDirection = (scrollDirection: ScrollDirection) => ({
  type: SET_MANAGE_USERS_SCROLL_DIRECTION,
  payload: scrollDirection,
})

export const addEventsToList = (events: IEvent[]) => ({
  type: ADD_EVENTS_TO_LIST,
  payload: events,
});