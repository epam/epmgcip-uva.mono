import { Language } from "./common";
import { UserStatus } from "./user";

export interface Feedback {
    text: string,
    date: string,
    creatorId: string,
}

export interface IVolunteer {
    id: string,
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string;
    language: Language[];
    education: string;
    specialization?: string;
    interests?: string;
    phone: string;
    email?: string;
    image?: string;
    locations?: string,
    experience?: string,
    info?: string,
    feedback?: Feedback[],
    status?: UserStatus,
    telegramName: string,
    telegramId?: number,
    eventCount?: number,
}