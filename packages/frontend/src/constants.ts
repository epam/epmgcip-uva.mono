import { EventStatus, Gender, Language, UserRole, UserStatus } from './types';
import translation from 'src/translations/Russian.json';

export const ROOT_ROUTE = '/';
export const EVENTS_ROUTE = '/events';
export const CREATE_EVENT_ROUTE = '/events/create';
export const VOLUNTEERS_ROUTE = '/volunteers';
export const MANAGE_USERS_ROUTE = '/users';
export const CREATE_USER_ROUTE = '/users/create';
export const EDIT_USER_ROUTE = '/users/edit/:telegramName';

export const USER_ROLES = [
  { name: translation.admin, value: UserRole.Admin },
  { name: translation.coordinator, value: UserRole.Coordinator },
];

export const USER_STATUSES = [
  { name: translation.active, value: UserStatus.Active },
  { name: translation.inactive, value: UserStatus.Inactive },
];

export const DEFAULT_NOTIFICATION = 'Default Notification Message';
export const NOTIFICATIONS = (value?: string) => ({
  USER_EXISTS: `Извините, пользователь c именем ${value} в Telegram уже существует. Пожалуйста, проверьте данные или обратитель с администратору`,
  USER_CREATED: `Пользователь ${value} успешно создан`,
  USER_CREATION_ERROR: `Ошибка при создании пользователя ${value}`,
  USER_DOES_NOT_EXIST: `Извините, пользователь c именем ${value} в Telegram не существует. Пожалуйста, проверьте данные или обратитель с администратору`,
  USER_UPDATED: `Пользователь ${value} успешно изменен`,
  USER_UPDATE_ERROR: `Ошибка при изменении пользователя ${value}`,
  USER_DELETED: `Пользователь ${value} успешно удален`,
  USER_DELETE_ERROR: `Ошибка при удалении пользователя ${value}`,
  USER_DOES_NOT_HAVE_ACCESS: translation.userDoesNotHaveAccess,
});

export const DELETE_USER_QUESTION = (value: string) =>
  `Вы точно хотите удалить пользователя ${value}?`;

export const LOGOUT_USER_QUESTION = 'Вы точно хотите выйти?';

export const EMPTY_USER = {
  id: '00000000-0000-0000-0000-000000000000',
  name: '',
  telegramName: '',
  role: UserRole.Coordinator,
  status: UserStatus.Inactive,
};

export const DEVELOPMENT_ENVIRONMENT_URL = 'https://epmgcip-uva-develop.web.app/';
export const LOCAL_OR_TEST_ENVIRONMENTS = ['localhost', 'epmgcip-uva-develop'];

export const VOLUNTEER_GENDER = [
  { name: translation.men, value: Gender.Men },
  { name: translation.women, value: Gender.Women },
  { name: translation.any, value: Gender.Any },
];

export const LANGUAGE = [
  { name: translation.russian, value: Language.Russian },
  { name: translation.uzbek, value: Language.Uzbek },
  { name: translation.english, value: Language.English },
  { name: translation.qoraqalpoq, value: Language.Qoraqalpoq },
]

export const EVENT_STATUS = [
  { name: translation.active, value: EventStatus.Active },
  { name: translation.draft, value: EventStatus.Draft },
]