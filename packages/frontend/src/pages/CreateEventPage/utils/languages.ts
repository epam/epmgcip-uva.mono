import russianTranslation from 'src/translations/Russian.json';
import englishTranslation from 'src/translations/English.json';
import karakalpakTranslation from 'src/translations/Karakalpak.json';
import uzbekTranslation from 'src/translations/Uzbek.json';
import { Reducer } from 'react';
import { EventLanguageSpecificFields, IEvent, Language } from 'src/types';
import { LanguageReducerAction } from '../types';

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
  if (action.event === 'toggle') {
    const operation = action.language in state ? 'remove' : 'add';
    switch (operation) {
      case 'add':
        return {
          ...state,
          [action.language]: getEmptyLanguageData(action.language),
        };
      case 'remove': {
        if (Object.keys(state).length === 1) {
          // todo: show alert that only language can't be deleted
          return state;
        }
        if (
          !action.withApproval ||
          (state[action.language]?.name === '' &&
            state[action.language]?.description === '' &&
            state[action.language]?.place === '')
        ) {
          const newState = { ...state };
          delete newState[action.language];
          return newState;
        } else {
          // todo: show dialog with warning that data will be lost
          return state;
        }
      }
    }
  }
  if (action.event === 'change' && action.update) {
    return {
      ...state,
      [action.language]: {
        ...state[action.language],
        ...action.update,
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
