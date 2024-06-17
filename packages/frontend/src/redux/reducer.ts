import { IState, IUser, ScrollDirection } from 'src/types';
import {
  ADD_USERS_TO_LIST,
  IAction,
  SAVE_EVENTS,
  SET_EDITOR,
  SET_EVENTS_LOADING,
  SET_EVENT_STATUS_FILTER,
  SET_MANAGE_EVENTS_SCROLL_DIRECTION,
  SET_MANAGE_EVENTS_SCROLL_SIZE,
  SET_MANAGE_USERS_SCROLL_DIRECTION,
  SET_MANAGE_USERS_SCROLL_SIZE,
  SET_SHOW_MENU,
  SET_USER_SEARCH_INPUT,
  UPDATE_USERS_LIST
} from './types';

const initialState: IState = {
  editor: {} as IUser,
  usersList: [] as IUser[],
  manageUsersPage: {
    userSearchInput: '',
    scrollDirection: ScrollDirection.Down,
    scrollSize: 0,
  },
  manageEventsPage: {
    statusFilter: 'all' as const,
    scrollDirection: ScrollDirection.Down,
    scrollSize: 0,
    limit: 20,
    data: {
      initialized: false,
      error: false,
      loading: true,
      finished: false,
      data: []
    }
  },
  isMenu: false,
  loading: false,
  error: null,
};

const rootReducer = (state = initialState, action: IAction): IState => {
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
    // USERS
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
    //EVENTS
    case SET_EVENTS_LOADING:
      return {
        ...state, manageEventsPage: {
          ...state.manageEventsPage,
          data: {
            ...state.manageEventsPage.data,
            loading: action.payload,
          }
        }
      };
    case SAVE_EVENTS:
      return {
        ...state, manageEventsPage: {
          ...state.manageEventsPage,
          data: {
            ...state.manageEventsPage.data,
            initialized: true,
            data: action.payload.initialized ?
              [...(state.manageEventsPage.data.data ?? []), ...action.payload.data]
              : [...action.payload.data],
            finished: action.payload.isLast,
            error: action.payload.isError,
            loading: false,
          }
        }
      };
    case SET_EVENT_STATUS_FILTER:
      if (state.manageEventsPage.statusFilter === action.payload) {
        return state;
      }
      return {
        ...state,
        manageEventsPage: {
          ...state.manageEventsPage,
          statusFilter: action.payload,
          data: {
            initialized: false,
            error: false,
            loading: true,
            finished: false,
            data: []
          }
        },
      };
    case SET_MANAGE_EVENTS_SCROLL_SIZE:
      return {
        ...state,
        manageEventsPage: {
          ...state.manageEventsPage,
          scrollSize: action.payload,
        },
      };
    case SET_MANAGE_EVENTS_SCROLL_DIRECTION:
      return {
        ...state,
        manageEventsPage: {
          ...state.manageEventsPage,
          scrollDirection: action.payload,
        },
      };
    default:
      return state;
  }
};

export default rootReducer;
