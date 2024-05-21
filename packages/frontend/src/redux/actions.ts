import { FilterEventStatuses, IEvent, IUser, ScrollDirection } from 'src/types';
import {
  ADD_EVENTS_TO_LIST,
  ADD_USERS_TO_LIST,
  SET_EDITOR,
  SET_EVENTS,
  SET_EVENT_PAGE,
  SET_EVENT_STATUS_FILTER,
  SET_MANAGE_USERS_SCROLL_DIRECTION,
  SET_MANAGE_USERS_SCROLL_SIZE,
  SET_SHOW_MENU,
  SET_USER_SEARCH_INPUT,
  UPDATE_USERS_LIST,
} from './types';

export const setEditor = (editor: IUser) => ({
  type: SET_EDITOR,
  payload: editor,
});

export const setMenu = (menuState: boolean) => ({
  type: SET_SHOW_MENU,
  payload: menuState,
});

// USERTS
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

// EVENTS

export const addEventsToList = (events: IEvent[]) => ({
  type: ADD_EVENTS_TO_LIST,
  payload: events,
});

export const saveEvents = (events: IEvent[]) => ({
  type: SET_EVENTS,
  payload: events,
});

export const setEventsPage = (page: number) => ({
  type: SET_EVENT_PAGE,
  payload: page,
});

export const setEventsStatusFilter = (statusFilter: FilterEventStatuses) => ({
  type: SET_EVENT_STATUS_FILTER,
  payload: statusFilter,
});