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
  const data = event.languageSpecificData?.data;
  if (!data) {
    return;
  }
  if (language) {
    return data[language]?.name;
  }
  if (Language.Russian in data) {
    return data[Language.Russian]!.name;
  }
  return Object.values(data)[0].name;
};

export const getEventPlaceInLanguage = (event: IEvent, language?: Language): string | undefined => {
  const data = event.languageSpecificData?.data;
  if (!data) {
    return;
  }
  if (language) {
    return data[language]?.place;
  }
  if (Language.Russian in data) {
    return data[Language.Russian]!.place;
  }
  return Object.values(data)[0].place;
};

export const getEventLanguageSpecificData = (event: IEvent, language?: Language) => {
  const data = event.languageSpecificData?.data;
  if (!data) {
    return;
  }
  if (language) {
    return data[language];
  }
  if (Language.Russian in data) {
    return data[Language.Russian];
  }
  return Object.values(data)[0];
};
