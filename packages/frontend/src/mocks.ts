import { TelegramUser } from './components';
import { IUser, UserRole, UserStatus } from './types';

type AuthMock = {
  user: IUser;
  tgUser: TelegramUser;
};

export const ADMIN_ACTIVE_MOCK: AuthMock = {
  user: {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Monroe Panela',
    telegramName: '@panela',
    telegramNameLowCase: '@panela',
    role: UserRole.Admin,
    status: UserStatus.Active,
  },
  tgUser: {
    id: 1,
    first_name: 'Monroe',
    last_name: 'Panela',
    username: 'panela',
    photo_url: 'https://t.me/i/userpic/320/panela.jpg',
    auth_date: new Date().getTime(),
    hash: 'hash',
  },
};

export const COORDINATOR_ACTIVE_MOCK: AuthMock = {
  user: {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'John Doe',
    telegramName: '@john_doe',
    telegramNameLowCase: '@john_doe',
    role: UserRole.Coordinator,
    status: UserStatus.Active,
  },
  tgUser: {
    id: 2,
    first_name: 'John',
    last_name: 'Doe',
    username: 'john_doe',
    photo_url: 'https://t.me/i/userpic/320/john_doe.jpg',
    auth_date: new Date().getTime(),
    hash: 'hash',
  },
};

export const ADMIN_INACTIVE_MOCK: AuthMock = {
  user: {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Old Burito',
    telegramName: '@Burito',
    telegramNameLowCase: '@burito',
    role: UserRole.Admin,
    status: UserStatus.Inactive,
  },
  tgUser: {
    id: 3,
    first_name: 'Old',
    last_name: 'Burito',
    username: 'burito',
    photo_url: 'https://t.me/i/userpic/320/burito.jpg',
    auth_date: new Date().getTime(),
    hash: 'hash',
  },
};

export const COORDINATOR_INACTIVE_MOCK: AuthMock = {
  user: {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Crazy Carrot',
    telegramName: '@carrot',
    telegramNameLowCase: '@carrot',
    role: UserRole.Coordinator,
    status: UserStatus.Inactive,
  },
  tgUser: {
    id: 4,
    first_name: 'Crazy',
    last_name: 'Carrot',
    username: 'carrot',
    photo_url: 'https://t.me/i/userpic/320/carrot.jpg',
    auth_date: new Date().getTime(),
    hash: 'hash',
  },
};
