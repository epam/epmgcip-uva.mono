export interface IUser {
  id: string;
  name: string;
  telegramName: string;
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

export interface IState {
  editor: IUser;
  isMenu: boolean;
  usersList: IUser[];
  manageUsersPage: {
    userSearchInput: string;
    scrollSize: number;
    scrollDirection: ScrollDirection;
  }
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

export enum EventStatus {
  Draft = 'draft',
  Active = 'active',
}

export enum Gender {
  Men = 'men',
  Women = 'women',
  Any = 'any'
}

export enum Language {
  Russian = 'russian',
  Uzbek = 'uzbek',
  English = 'english',
  Qoraqalpoq = 'qoraqalpoq'
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
  ageMin: string;
  ageMax: string;
  language: string;
  volunteersQuantity: string;
  status: EventStatus;
  imageUrl: string;
  endDate?: string;
  telegramChannelLink?: string;
}

export interface IOption {
  name: string;
  value: string;
}