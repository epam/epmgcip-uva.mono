import { UserRole, UserStatus } from "./types";

export const ROOT_ROUTE = '/';
export const LOGIN_ROUTE = '/login';
export const EVENTS_ROUTE = '/events';
export const CREATE_EVENT_ROUTE = '/events/create';
export const VOLUNTEERS_ROUTE = '/volunteers';
export const MANAGE_USERS_ROUTE = '/users';
export const CREATE_USER_ROUTE = '/users/create';

export const USER_ROLES = [
    { name: 'Админ', value: UserRole.Admin },
    { name: 'Координатор', value: UserRole.Coordinator },
]
 
export const USER_STATUSES = [
    { name: 'Активный', value: UserStatus.Active },
    { name: 'Неактивный', value: UserStatus.Inactive },
]

export const DEFAULT_NOTIFICATION = 'Default Notification Message';
export const NOTIFICATIONS = (value: string) => ({
    USER_EXISTS: `Извините, пользователь c именем ${value} в Telegram уже существует. Пожалуйста, проверьте данные или обратитель с администратору`,
    USER_CREATED: `Пользователь ${value} успешно создан`,
    USER_CREATION_ERROR: `Ошибка при создании пользователя ${value}`,
})