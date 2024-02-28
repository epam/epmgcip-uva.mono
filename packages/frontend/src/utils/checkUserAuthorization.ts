import { IUser, UserRole, UserStatus } from "src/types";

export const checkUserAuthorization = (user?: IUser): UserRole | false => {
    if (!user || Object.keys(user).length === 0) return false;

    if (user.status === UserStatus.Inactive) return false;

    return user.role;
}