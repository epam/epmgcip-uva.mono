import { TelegramUser } from 'src/components';
import { API_URL } from 'src/constants';
import { IUser, UserRole, UserStatus } from 'uva-shared';

export const getToken = async (user: TelegramUser): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/auth-tg`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return typeof data.token === 'string' ? data.token : null;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};

export const loginWithToken = () => {};

export const checkUserAuthorization = (user: IUser): UserRole | false => {
  return user != null &&
    Object.keys(user).length > 0 &&
    [UserRole.Admin, UserRole.Coordinator].includes(user.role) &&
    user.status === UserStatus.Active
    ? user.role
    : false;
};
