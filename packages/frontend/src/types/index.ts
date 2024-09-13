import { EventStatus, IEvent, IUser, IVolunteer } from 'uva-shared';

export enum ScrollDirection {
  Up = 'up',
  Down = 'down',
}

export {
  CreateEventAlerts,
  EventStatus,
  Gender,
  ImageType,
  Language,
  Month,
  UserRole,
  UserStatus,
  languages,
  languagesShort,
} from 'uva-shared';

export type {
  EventLanguageSpecific,
  EventLanguageSpecificData,
  EventLanguageSpecificFields,
  IEvent,
  IUser,
  IVolunteer,
} from 'uva-shared';

export type FilterEventStatuses = EventStatus | 'all';

export enum UpdateEventAlerts {
  None = 10,
  ConfirmUpdateDraft,
  ConfirmUpdateActive,
  ConfirmPublishToTelegram,
  ConfirmDeleteFromTelegram,
  ShowEventPublishSuccess,
  ShowEventPublishCancellation,
  ConfirmAddNewLanguageSpecificData,
  ConfirmDefaultUpdate,
  ConfirmEventWithExistingStatusActive,
}

interface IData<T> {
  // first data load was done
  initialized: boolean;
  // error occured during data load
  error: boolean;
  // data is currently loading
  loading: boolean;
  // reached last page of data
  finished: boolean;
  // all loaded data
  data: T[];
}

export interface IState {
  editor: IUser;
  isMenu: boolean;
  usersList: IUser[];
  manageUsersPage: {
    userSearchInput: string;
    scrollSize: number;
    scrollDirection: ScrollDirection;
  };
  manageEventsPage: {
    statusFilter: FilterEventStatuses;
    scrollDirection: ScrollDirection;
    limit: number;
    scrollSize: number;

    data: IData<IEvent>;
  };
  loading: boolean;
  error: null | string;
}

export type IValidationError = { [key: string]: string };

export interface IOption {
  name: string;
  value: string;
}
