export interface IUser {
  id: string;
  name: string;
  telegramName: string;
  role: UserRole;
  status: UserStatus;
  telegramId?: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface IState {
  editor: {
    name: string;
  };
  isMenu: boolean;
  usersList: IUser[];
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
