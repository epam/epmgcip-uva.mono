import { IUser, UserRole, UserStatus } from './types';

export const ADMIN_ACTIVE_MOCK: IUser = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'Monroe Panela',
  telegramName: '@panela',
  telegramNameLowCase: '@panela',
  role: UserRole.Admin,
  status: UserStatus.Active,
};

export const COORDINATOR_ACTIVE_MOCK: IUser = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'John Doe',
  telegramName: '@john_doe',
  telegramNameLowCase: '@john_doe',
  role: UserRole.Coordinator,
  status: UserStatus.Active,
};

export const ADMIN_INACTIVE_MOCK: IUser = {
  id: '00000000-0000-0000-0000-000000000003',
  name: 'Old Burito',
  telegramName: '@Burito',
  telegramNameLowCase: '@burito',
  role: UserRole.Admin,
  status: UserStatus.Inactive,
};

export const COORDINATOR_INACTIVE_MOCK: IUser = {
  id: '00000000-0000-0000-0000-000000000004',
  name: 'Crazy Carrot',
  telegramName: '@carrot',
  telegramNameLowCase: '@carrot',
  role: UserRole.Coordinator,
  status: UserStatus.Inactive,
};
