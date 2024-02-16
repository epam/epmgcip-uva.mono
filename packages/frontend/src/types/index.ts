export interface IState {
    userName: string;
    isMenu: boolean;
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
    
  export interface IUser {
    id: string;
    name: string;
    telegramId: string;
    telegramName: string;
    role: UserRole;
    status: UserStatus;
    createdAt?: string;
    createdBy?: string;
    updatedAt?: string;
    updateBy?: string;
  }
  
  export interface IUserCreation
    extends Pick<
      IUser,
      'name' | 'telegramName' | 'role' | 'status'
    > {}
  