import {AtLeastOne} from "./utiliy";

export interface IUser {
  id: string;
  name: string;
  telegramName: string;
  telegramNameLowCase: string;
  role: UserRole;
  status: UserStatus;
  telegramId?: number;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export enum ScrollDirection {
  Up = "up",
  Down = "down",
}

export enum EventStatus {
  Draft = "draft",
  Active = "active",
  Completed = "completed",
  Canceled = "canceled",
}

export type FilterEventStatuses = EventStatus | "all";

export enum Gender {
  Men = "men",
  Women = "women",
  Any = "any",
}

export enum Language {
  Russian = "russian",
  Uzbek = "uzbek",
  English = "english",
  Qoraqalpoq = "qoraqalpoq",
}

export const languages: Language[] = [
  Language.Russian,
  Language.Uzbek,
  Language.English,
  Language.Qoraqalpoq,
];

export const languagesShort: Record<Language, string> = {
  [Language.Russian]: "Рус",
  [Language.Uzbek]: "Uzb",
  [Language.English]: "Eng",
  [Language.Qoraqalpoq]: "Kaa",
};

export interface EventLanguageSpecificFields {
  type: Language;
  name: string;
  description: string;
  place: string;
}

export enum CreateEventAlerts {
  None,
  ForbidOnlyLanguageDeletion,
  ConfirmLanguageDeletion,
  Leaving,
}

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

export interface EventLanguageSpecificData {
  [Language.Russian]: EventLanguageSpecificFields;
  [Language.Uzbek]: EventLanguageSpecificFields;
  [Language.English]: EventLanguageSpecificFields;
  [Language.Qoraqalpoq]: EventLanguageSpecificFields;
}

export type EventLanguageSpecific = {
  data: AtLeastOne<EventLanguageSpecificData>;
  alert?: CreateEventAlerts;
  alertData?: {
    language: Language;
  };
};

export interface IEvent {
  id: string;
  languageSpecificData: EventLanguageSpecific;
  startDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  registrationDate: string;
  gender: Gender;
  ageMin: number;
  ageMax: number;
  volunteersQuantity: string;
  status: EventStatus;
  endDate?: string;
  telegramChannelLink?: string;

  image: string;
  imageUrl?: string;
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

export enum UserRole {
  Admin = "admin",
  Coordinator = "coordinator",
}

export enum UserStatus {
  Active = "active",
  Inactive = "inactive",
}

export type IValidationError = { [key: string]: string };

export interface IOption {
  name: string;
  value: string;
}

export enum ImageType {
  Webp = "image/webp",
  Jpeg = "image/jpeg",
  Jpg = "image/jpg",
  Png = "image/png",
}

export enum Month {
  January = "january",
  February = "february",
  March = "march",
  April = "april",
  May = "may",
  June = "june",
  July = "july",
  August = "august",
  September = "september",
  October = "october",
  November = "november",
  December = "december",
}
