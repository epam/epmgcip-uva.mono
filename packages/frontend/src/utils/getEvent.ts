import { doc, getDoc } from 'firebase/firestore';
import { firebaseDb } from 'src/main';
import { IEvent, Language } from 'src/types';

export const getEvent = async (eventId: string) => {
  const docRef = doc(firebaseDb, 'events', eventId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as IEvent;
  }

  return undefined;
};

export const getEventNameInLanguage = (event: IEvent, language?: Language): string | undefined => {
  if (language) {
    return event.languageSpecificData[language]?.name;
  }
  if (Language.Russian in event.languageSpecificData) {
    return event.languageSpecificData[Language.Russian]!.name;
  }
  return Object.values(event.languageSpecificData)[0].name;
};

export const getEventLanguageSpecificData = (event: IEvent, language?: Language) => {
  if (language) {
    return event.languageSpecificData[language];
  }
  if (Language.Russian in event.languageSpecificData) {
    return event.languageSpecificData[Language.Russian];
  }
  return Object.values(event.languageSpecificData)[0];
};
