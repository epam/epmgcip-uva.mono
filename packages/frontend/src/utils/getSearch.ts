import { IUser } from 'src/types';

export const getSearch = (users: IUser[], value?: string) => {
  if (users.length === 0 || !value) return users;

  return users.filter(
    (user) =>
      user.name.startsWith(value) ||
      user.name.toLowerCase().startsWith(value) ||
      user.telegramName.toLowerCase().startsWith(value) ||
      user.telegramName.slice(1).toLowerCase().startsWith(value)
  );
};
