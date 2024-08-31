export { FirebaseCollection } from 'uva-shared';
import { EventStatus, Gender, ImageType, Language, Month, UserRole, UserStatus } from './types';
import translation from 'src/translations/Russian.json';

export const API_URL = import.meta.env.VITE_CLOUD_FUNCTIONS_URL;

export const STORAGE_BUCKET = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;
export const STORAGE_IMAGES_PATH = 'public/images';

export const ROOT_ROUTE = '/';
export const EVENTS_ROUTE = '/events';
export const EVENT_DETAILS_ROUTE = '/event/:eventId';
export const EDIT_EVENT_ROUTE = '/event/edit/:eventId';
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

export enum FirebaseCollection {
  Users = 'users',
  Events = 'events',
}

export const DEFAULT_NOTIFICATION = 'Default Notification Message';
export const NOTIFICATIONS = (value?: string) => ({
  USER_EXISTS: `Извините, пользователь c именем ${value} в Telegram уже существует. Пожалуйста, проверьте данные или обратитесь к администратору`,
  USER_CREATED: `Пользователь ${value} успешно создан`,
  USER_CREATION_ERROR: `Ошибка при создании пользователя ${value}`,
  USER_DOES_NOT_EXIST: `Извините, пользователь c именем ${value} в Telegram не существует. Пожалуйста, проверьте данные или обратитесь к администратору`,
  USER_UPDATED: `Пользователь ${value} успешно изменен`,
  USER_UPDATE_ERROR: `Ошибка при изменении пользователя ${value}`,
  USER_DELETED: `Пользователь ${value} успешно удален`,
  USER_DELETE_ERROR: `Ошибка при удалении пользователя ${value}`,
  USER_DOES_NOT_HAVE_ACCESS: translation.userDoesNotHaveAccess,
  IMAGE_TOO_BIG: 'Извините, загрузка изображения невозможна. Размер не должен превышать 10MB',
  IMAGE_WRONG_TYPE:
    'Извините, загрузка изображения невозможна. Разрешены следующие форматы изображений: png, jpg, jpeg, webp',
  EVENT_EXISTS: `Извините, событие c id ${value} в Telegram уже существует. Пожалуйста, проверьте данные или обратитесь к администратору`,
  EVENT_UPDATE_ERROR: `Ошибка сохранения события ${value}`,
  EVENT_CREATED: `Событие ${value} успешно создано`,
  EVENT_UPDATED: `Событие ${value} успешно обновлено`,
  EVENT_DELETED: `Событие ${value} успешно удалено`,
  EVENT_DELETE_ERROR: `Ошибка при удалении события ${value}`,
  EVENT_CREATION_ERROR: `Ошибка при создании события ${value}`,
});

export const languagesLong: Record<Language, string> = {
  [Language.Russian]: 'Русский',
  [Language.Uzbek]: "O'zbek",
  [Language.English]: 'English',
  [Language.Qoraqalpoq]: 'Karakalpak',
};

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
export const LOCAL_ENVIRONMENT = ['localhost'];
export const TEST_ENVIRONMENTS = ['epmgcip-uva-develop'];

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
];

export const EVENT_STATUS = [
  { name: translation.active, value: EventStatus.Active },
  { name: translation.draft, value: EventStatus.Draft },
];

export const EVENT_STATUS_FOR_ACTIVE = [
  { name: translation.active, value: EventStatus.Active },
  { name: translation.canceledEvent, value: EventStatus.Canceled },
];

export const IMAGE_TYPE = [ImageType.Jpeg, ImageType.Jpg, ImageType.Png, ImageType.Webp];

// export const MONTHS = {
//   [Month.January]: translation.january,
//   [Month.February]: translation.february,
//   [Month.March]: translation.march,
//   [Month.April]: translation.april,
//   [Month.May]: translation.may,
//   [Month.June]: translation.june,
//   [Month.July]: translation.july,
//   [Month.August ]: translation.august,
//   [Month.September]: translation.september,
//   [Month.October]: translation.october,
//   [Month.November]: translation.november,
//   [Month.December]: translation.december,
// };
export const MONTHS = [
  { name: translation.january, value: Month.January },
  { name: translation.february, value: Month.February },
  { name: translation.march, value: Month.March },
  { name: translation.april, value: Month.April },
  { name: translation.may, value: Month.May },
  { name: translation.june, value: Month.June },
  { name: translation.july, value: Month.July },
  { name: translation.august, value: Month.August },
  { name: translation.september, value: Month.September },
  { name: translation.october, value: Month.October },
  { name: translation.november, value: Month.November },
  { name: translation.december, value: Month.December },
];

export const DEFAULT_MIN_AGE = 16;
export const DEFAULT_MAX_AGE = 61;
