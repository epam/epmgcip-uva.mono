import { Language, EventLanguageSpecificFields } from 'src/types';

export interface LanguageReducerAction {
  event: 'toggle' | 'change';
  language: Language;
  withApproval: boolean;
  update?: Partial<EventLanguageSpecificFields>;
}
