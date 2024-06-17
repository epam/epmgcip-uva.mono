import { FilterEventStatuses, IEvent, IUser, ScrollDirection } from 'src/types';
import {
  ADD_USERS_TO_LIST,
  IAction,
  SAVE_EVENTS,
  SET_EDITOR,
  SET_EVENTS_LOADING,
  SET_EVENT_STATUS_FILTER,
  SET_MANAGE_USERS_SCROLL_DIRECTION,
  SET_MANAGE_USERS_SCROLL_SIZE,
  SET_SHOW_MENU,
  SET_USER_SEARCH_INPUT,
  UPDATE_USERS_LIST
} from './types';

export const setEditor = (editor: IUser): IAction => ({
  type: SET_EDITOR,
  payload: editor,
});

export const setMenu = (menuState: boolean): IAction => ({
  type: SET_SHOW_MENU,
  payload: menuState,
});

// USERTS
export const addUsersToList = (users: IUser[]): IAction => ({
  type: ADD_USERS_TO_LIST,
  payload: users,
});

export const updateUsersList = (users: IUser[]): IAction => ({
  type: UPDATE_USERS_LIST,
  payload: users,
});

export const setManageUsersSearchInput = (searchInput: string): IAction => ({
  type: SET_USER_SEARCH_INPUT,
  payload: searchInput,
});

export const setManageUsersScrollSize = (scrollSize: number): IAction => ({
  type: SET_MANAGE_USERS_SCROLL_SIZE,
  payload: scrollSize,
})

export const setManageUsersScrollDirection = (scrollDirection: ScrollDirection): IAction => ({
  type: SET_MANAGE_USERS_SCROLL_DIRECTION,
  payload: scrollDirection,
})

// EVENTS

export const setEventsLoading = (loading: boolean): IAction => ({
  type: SET_EVENTS_LOADING,
  payload: loading,
});

export const saveEvents = (events: IEvent[], isError: boolean, isLast: boolean, initialized: boolean = true): IAction => ({
  type: SAVE_EVENTS,
  payload: { isError, isLast, data: events, initialized },
});

export const setEventsStatusFilter = (statusFilter: FilterEventStatuses): IAction => ({
  type: SET_EVENT_STATUS_FILTER,
  payload: statusFilter,
});