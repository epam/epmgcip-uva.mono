import { IAction, IEvent, IState, IUser, ScrollDirection } from 'src/types';
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

const initialState: IState = {
  editor: {} as IUser,
  usersList: [] as IUser[],
  eventsList: [] as IEvent[],
  manageUsersPage: {
    userSearchInput: '',
    scrollDirection: ScrollDirection.Down,
    scrollSize: 0,
  },
  isMenu: false,
  loading: false,
  error: null,
};

const rootReducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_EDITOR:
      return {
        ...state,
        editor: action.payload,
        error: null,
        loading: false,
      };
    case SET_SHOW_MENU:
      return {
        ...state,
        isMenu: action.payload,
      };
    case ADD_USERS_TO_LIST:
      return {
        ...state,
        usersList: [...action.payload, ...state.usersList],
      };
    case UPDATE_USERS_LIST:
      return {
        ...state,
        usersList: [...action.payload],
      };
    case ADD_EVENTS_TO_LIST:
      return {
        ...state,
        eventsList: [...action.payload, ...state.eventsList],
      };
    case SET_USER_SEARCH_INPUT:
      return {
        ...state,
        manageUsersPage: {
          ...state.manageUsersPage,
          userSearchInput: action.payload,
        },
      };
    case SET_MANAGE_USERS_SCROLL_SIZE:
      return {
        ...state,
        manageUsersPage: {
          ...state.manageUsersPage,
          scrollSize: action.payload,
        },
      };
    case SET_MANAGE_USERS_SCROLL_DIRECTION:
      return {
        ...state,
        manageUsersPage: {
          ...state.manageUsersPage,
          scrollDirection: action.payload,
        },
      };
    default:
      return state;
  }
};

export default rootReducer;
