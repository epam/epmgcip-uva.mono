import { IUser, UserRole, UserStatus } from "./types";

export const ADMIN_MOCK: IUser = {
    id: '00000000-0000-0000-0000-000000000000',
    name: 'Monroe Panela',
    telegramName: '@panela',
    role: UserRole.Admin,
    status: UserStatus.Active,
}

export const COORDINATOR_MOCK: IUser = {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'John Doe',
    telegramName: '@john_doe',
    role: UserRole.Coordinator,
    status: UserStatus.Active,
}