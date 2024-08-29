import {getFormatDate} from "../utils/index";
import translation from "../translations/Russian.json";
import * as admin from "firebase-admin";

export const createMessage = (
  event: admin.firestore.DocumentData,
  description: string,
  title: string,
  eventPlace: string,
  languageKeys: string
) => {
  return `
      <b>${event.status === "active" ?
    `${translation.openedRecruitment}` :
    `${translation.closeRecruitment}`}</b>
  
      <b>${title}</b>
  
      📍 ${eventPlace}
  
      📆 ${getFormatDate(event.startDate)} - ${
  event.endDate ? getFormatDate(event.endDate):
    "End is not specifyed."}
  
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
