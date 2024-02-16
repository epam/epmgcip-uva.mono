import { IAction, IState } from 'src/types';
import { SET_SHOW_MENU, SET_USER_NAME } from './types';
  
  
  const initialState: IState = {
    userName: '',
    isMenu: false,
    loading: false,
    error: null,
  };
  
  const rootReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
      case SET_USER_NAME:
        return {
          ...state,
          userName: action.payload,
          error: null,
          loading: false,
        };
      case SET_SHOW_MENU:
        return {
            ...state,
            isMenu: action.payload,
          };
      default:
        return state;
    }
  };
  
  export default rootReducer;