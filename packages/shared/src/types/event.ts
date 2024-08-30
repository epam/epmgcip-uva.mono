import { Gender, Language } from './common.js';
import { AtLeastOne } from './utility.js';

export enum EventStatus {
  Draft = 'draft',
  Active = 'active',
  Completed = 'completed',
  Canceled = 'canceled',
}

export interface EventLanguageSpecificFields {
  type: Language;
  name: string;
  description: string;
  place: string;
}

export interface EventLanguageSpecificData {
  [Language.Russian]: EventLanguageSpecificFields;
  [Language.Uzbek]: EventLanguageSpecificFields;
  [Language.English]: EventLanguageSpecificFields;
  [Language.Qoraqalpoq]: EventLanguageSpecificFields;
}

export enum CreateEventAlerts {
  None,
  ForbidOnlyLanguageDeletion,
  ConfirmLanguageDeletion,
  Leaving,
}

export type EventLanguageSpecific = {
  data: AtLeastOne<EventLanguageSpecificData>;
  alert?: CreateEventAlerts;
  alertData?: {
    language: Language;
  };
};

export interface IEvent {
  id: string;
  languageSpecificData: EventLanguageSpecific;
  startDate: string;
  startTime: string;
  endTime: string;
  duration: string;
  registrationDate: string;
  gender: Gender;
  ageMin: number;
  ageMax: number;
  volunteersQuantity: string;
  status: EventStatus;
  endDate?: string;
  telegramChannelLink?: string;

  image: string;
  imageUrl?: string;
}
