import { Language, EventLanguageSpecificFields } from 'src/types';

export enum LanguageEvent {
  Toggle = 'toggle',
  Change = 'change',
  ClearAlert = 'clearAlert',
}

export interface LanguageReducerAction {
  event: LanguageEvent;
  language: Language;
  withApproval: boolean;
  update?: Partial<EventLanguageSpecificFields>;
}
