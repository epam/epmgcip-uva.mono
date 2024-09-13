import { getFormatDate } from '../utils/index.js';
import translation from '../translations/Russian.json' assert { type: 'json' };
import { firestore } from 'firebase-admin';
import { EventStatus } from 'uva-shared';

export const createMessage = (
  event: firestore.DocumentData,
  description: string,
  title: string,
  eventPlace: string,
  languageKeys: string,
) => {
  return `
      <b>${event.status === EventStatus.Active ? `${translation.openedRecruitment}` : `${translation.closeRecruitment}`}</b>
  
      <b>${title}</b>
  
      📍 ${eventPlace}
  
      📆 ${getFormatDate(event.startDate)} - ${event.endDate ? getFormatDate(event.endDate) : 'End is not specified.'}
  
      🕒 ${event.startTime} - ${event.endTime}
      ${translation.eventHours}: ${event.duration}
  
      ${translation.gender}
      🚻 ${event.gender}
  
      ${translation.age}
      🔢 ${event.ageMin} - ${event.ageMax}
  
      ${translation.languages}
      🔠 ${languageKeys}
  
      ${translation.people}
      🙌 ${event.volunteersQuantity}
  
      ${description}
  
      Telegram | Instagram | Facebook | web
      `;
};
