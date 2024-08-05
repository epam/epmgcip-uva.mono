import { Reducer } from 'react';
import englishTranslation from 'src/translations/English.json';
import karakalpakTranslation from 'src/translations/Karakalpak.json';
import russianTranslation from 'src/translations/Russian.json';
import uzbekTranslation from 'src/translations/Uzbek.json';
import { CreateEventAlerts, EventLanguageSpecificFields, IEvent, Language } from 'src/types';
import { LanguageEvent, LanguageReducerAction } from '../types';

export const getEmptyLanguageData = (lang: Language): EventLanguageSpecificFields => ({
  type: lang,
  name: '',
  description: '',
  place: '',
});

export const languageSpecificDataReducer: Reducer<
  IEvent['languageSpecificData'],
  LanguageReducerAction
> = (state, action) => {
  if (action.event === LanguageEvent.Toggle) {
    const operation = action.language in state.data ? 'remove' : 'add';
    switch (operation) {
      case 'add':
        return {
          ...state,
          data: {
            ...state.data,
            [action.language]: getEmptyLanguageData(action.language),
          },
        };
      case 'remove': {
        if (Object.keys(state.data).length === 1) {
          return { ...state, alert: CreateEventAlerts.ForbidOnlyLanguageDeletion };
        }
        if (
          !action.withApproval ||
          (state.data[action.language]?.name === '' &&
            state.data[action.language]?.description === '' &&
            state.data[action.language]?.place === '')
        ) {
          const newStateData = { ...state.data };

          delete newStateData[action.language];

          return { data: newStateData };
        } else {
          return {
            ...state,
            alert: CreateEventAlerts.ConfirmLanguageDeletion,
            alertData: {
              language: action.language,
            },
          };
        }
      }
    }
  }

  if (action.event === LanguageEvent.ClearAlert) {
    return { ...state, alert: undefined, alertData: undefined };
  }

  if (action.event === LanguageEvent.Change && action.update) {
    return {
      ...state,
      data: {
        ...state.data,
        [action.language]: {
          ...state.data[action.language],
          ...action.update,
        },
      },
    };
  }
  return state;
};

interface Labels {
  readonly title: string;
  readonly name: string;
  readonly description: string;
  readonly place: string;
}

export const getLabels = (language: Language): Labels => {
  switch (language) {
    case Language.Russian:
      return {
        title: russianTranslation.self,
        name: russianTranslation.title,
        description: russianTranslation.description,
        place: russianTranslation.place,
      };
    case Language.English:
      return {
        title: englishTranslation.self,
        name: englishTranslation.title,
        description: englishTranslation.description,
        place: englishTranslation.place,
      };
    case Language.Qoraqalpoq:
      return {
        title: karakalpakTranslation.self,
        name: karakalpakTranslation.title,
        description: karakalpakTranslation.description,
        place: karakalpakTranslation.place,
      };
    case Language.Uzbek:
      return {
        title: uzbekTranslation.self,
        name: uzbekTranslation.title,
        description: uzbekTranslation.description,
        place: uzbekTranslation.place,
      };
  }
};
