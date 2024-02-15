import { SET_SHOW_MENU, SET_USER_NAME } from "./types";

export const setUserName = (name: string) => ({
    type: SET_USER_NAME,
    payload: name,
  });

export const setMenu = (menuState: boolean) => ({
    type: SET_SHOW_MENU,
    payload: menuState,
})