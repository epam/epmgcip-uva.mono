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
  Up = 'up',
  Down = 'down',
}

export enum EventStatus {
  Draft = 'draft',
  Active = 'active',
}

export enum Gender {
  Men = 'men',
  Women = 'women',
  Any = 'any',
}

export enum Language {
  Russian = 'russian',
  Uzbek = 'uzbek',
  English = 'english',
  Qoraqalpoq = 'qoraqalpoq',
}

export interface IEvent {
  id: string;
  name: string;
  description: string;
  place: string;
  startDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  registrationDate: string;
  gender: Gender;
  ageMin: number;
  ageMax: number;
  language: Language[];
  volunteersQuantity: string;
  status: EventStatus;
  image: string;
  endDate?: string;
  telegramChannelLink?: string;
}

export interface IState {
  editor: IUser;
  isMenu: boolean;
  usersList: IUser[];
  eventsList: IEvent[];
  manageUsersPage: {
    userSearchInput: string;
    scrollSize: number;
    scrollDirection: ScrollDirection;
  };
  loading: boolean;
  error: null | string;
}

export interface IAction {
  type: string;
  payload: never;
}

export enum UserRole {
  Admin = 'admin',
  Coordinator = 'coordinator',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export interface IValidationError {
  [key: string]: string;
}

export interface IOption {
  name: string;
  value: string;
}

export enum ImageType {
  Webp = 'image/webp',
  Jpeg = 'image/jpeg',
  Jpg = 'image/jpg',
  Png = 'image/png',
}

export enum Month {
  January = 'january',
  February = 'february',
  March = 'march',
  April = 'april',
  May = 'may',
  June = 'june',
  July = 'july',
  August = 'august',
  September = 'september',
  October = 'october',
  November = 'november',
  December = 'december',
}
