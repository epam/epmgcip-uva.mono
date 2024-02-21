import { IAction, IState, IUser } from 'src/types';
import {
  ADD_USERS_TO_LIST,
  SET_SHOW_MENU,
  SET_EDITOR_NAME,
  UPDATE_USERS_LIST,
} from './types';

const initialState: IState = {
  editor: {
    name: '',
  },
  usersList: [] as IUser[],
  isMenu: false,
  loading: false,
  error: null,
};

const rootReducer = (state = initialState, action: IAction) => {
  switch (action.type) {
    case SET_EDITOR_NAME:
      return {
        ...state,
        editor: { ...state.editor, name: action.payload },
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
        usersList: [ ...action.payload, ...state.usersList],
      };
    case UPDATE_USERS_LIST:
      return {
        ...state,
        usersList: [...action.payload],
      }
    default:
      return state;
  }
};

export default rootReducer;
