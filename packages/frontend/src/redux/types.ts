import { Action } from "@reduxjs/toolkit";
import { FilterEventStatuses, IEvent, IUser, ScrollDirection } from "src/types";

export const SET_EDITOR = 'SET_EDITOR';
type SetEditorPayload = IUser;
type SetEditorAction = InternalAction<typeof SET_EDITOR, SetEditorPayload>;

export const SET_SHOW_MENU = 'SET_SHOW_MENU';
type SetShowMenuPayload = boolean;
type SetShowMenuAction = InternalAction<typeof SET_SHOW_MENU, SetShowMenuPayload>;

export const ADD_USERS_TO_LIST = 'ADD_USERS_TO_LIST';
type AddUsersToListPayload = IUser[];
type AddUsersToListAction = InternalAction<typeof ADD_USERS_TO_LIST, AddUsersToListPayload>;

export const UPDATE_USERS_LIST = 'UPDATE_USERS_LIST';
type UpdateUsersListPayload = IUser[];
type UpdateUsersListAction = InternalAction<typeof UPDATE_USERS_LIST, UpdateUsersListPayload>;

export const CHANGE_EVENT_INITIALIZER_VALUE = 'CHANGE_EVENT_INITIALIZER_VALUE';
type ChangeEventInitializerValuePayload = boolean;
type ChangeEventInitializerValueAction = InternalAction<typeof CHANGE_EVENT_INITIALIZER_VALUE, ChangeEventInitializerValuePayload>;

export const SET_USER_SEARCH_INPUT = 'SET_USER_SEARCH_INPUT';
type SetUserSearchInputPayload = string;
type SetUserSearchInputAction = InternalAction<typeof SET_USER_SEARCH_INPUT, SetUserSearchInputPayload>;

export const SET_MANAGE_USERS_SCROLL_SIZE = 'SET_MANAGE_USERS_SCROLL_SIZE';
type SetMenageUsersScrollSizePayload = number;
type SetMenageUsersScrollSizeAction = InternalAction<typeof SET_MANAGE_USERS_SCROLL_SIZE, SetMenageUsersScrollSizePayload>;

export const SET_MANAGE_EVENTS_SCROLL_SIZE = 'SET_MANAGE_EVENTS_SCROLL_SIZE';
type SetManageEventsScrollSizePayload = number;
type SetManageEventsScrollSizeAction = InternalAction<typeof SET_MANAGE_EVENTS_SCROLL_SIZE, SetManageEventsScrollSizePayload>;

export const SET_MANAGE_USERS_SCROLL_DIRECTION = 'SET_MANAGE_USERS_SCROLL_DIRECTION';
type SetManageUsersScrollDirectionPayload = ScrollDirection;
type SetManageUsersScrollDirectionAction = InternalAction<typeof SET_MANAGE_USERS_SCROLL_DIRECTION, SetManageUsersScrollDirectionPayload>;

export const SET_MANAGE_EVENTS_SCROLL_DIRECTION = 'SET_MANAGE_EVENTS_SCROLL_DIRECTION';
type SetManageEventsScrollDirectionPayload = ScrollDirection;
type SetManageEventsScrollDirectionAction = InternalAction<typeof SET_MANAGE_EVENTS_SCROLL_DIRECTION, SetManageEventsScrollDirectionPayload>;

export const SET_EVENTS_LOADING = 'SET_EVENTS_LOADING';
type SetEventsLoadingPayload = boolean;
type SetEventsLoadingAction = InternalAction<typeof SET_EVENTS_LOADING, SetEventsLoadingPayload>;

export const SET_VOLUNTEERS_LOADING = 'SET_VOLUNTEERS_LOADING';
type SetVolunteersLoadingPayload = boolean;
type SetVolunteersLoadingAction = InternalAction<typeof SET_VOLUNTEERS_LOADING, SetVolunteersLoadingPayload>;

export const SAVE_EVENTS = 'SAVE_EVENTS';
type SaveEventsPayload = {
    isError: boolean;
    isLast: boolean;
    data: IEvent[];
    initialized?: boolean;
}
type SaveEventsAction = InternalAction<typeof SAVE_EVENTS, SaveEventsPayload>;

export const SET_EVENT_STATUS_FILTER = 'SET_EVENT_STATUS_FILTER';
type SetEventStatusFilterPayload = FilterEventStatuses;
type SetEventStatusFilterAction = InternalAction<typeof SET_EVENT_STATUS_FILTER, SetEventStatusFilterPayload>;

type InternalAction<K extends string, P = never> = Action<K> & {
    payload: P;
}

export type IAction = SetEditorAction |
    AddUsersToListAction |
    SetEventsLoadingAction |
    SetVolunteersLoadingAction |
    SetEventStatusFilterAction |
    SetShowMenuAction |
    SetManageEventsScrollDirectionAction |
    SetManageUsersScrollDirectionAction |
    SetManageEventsScrollSizeAction |
    SetMenageUsersScrollSizeAction |
    SetUserSearchInputAction |
    UpdateUsersListAction |
    SaveEventsAction |
    ChangeEventInitializerValueAction;