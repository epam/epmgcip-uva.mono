import { IUser } from 'src/types';

export const getSearch = (users: IUser[], value?: string) => {
  if (users.length === 0 || !value) return users;

  const unsensitiveValue = value.toLowerCase();

  return users.filter(
    (user) =>
      user.name.toLowerCase().startsWith(unsensitiveValue) ||
      user.telegramName.toLowerCase().startsWith(unsensitiveValue) ||
      user.telegramName.slice(1).toLowerCase().startsWith(unsensitiveValue)
  );
};
