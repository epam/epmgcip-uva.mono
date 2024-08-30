import { EventLanguageSpecific } from 'uva-shared';

export const formatLanguageSpecificData = (languageSpecificData: EventLanguageSpecific) => {
  const description = Object.entries(languageSpecificData.data)
    .map(([, data]) => `${data.description}`)
    .join(' / ');
  const title = Object.entries(languageSpecificData.data)
    .map(([, data]) => `${data.name}`)
    .join(' / ');
  const eventPlace = Object.entries(languageSpecificData.data)
    .map(([, data]) => `${data.place}`)
    .join(' / ');
  const languageKeys = Object.keys(languageSpecificData.data).join(', ');
  return {
    description: description,
    title: title,
    eventPlace: eventPlace,
    languageKeys: languageKeys,
  };
};
