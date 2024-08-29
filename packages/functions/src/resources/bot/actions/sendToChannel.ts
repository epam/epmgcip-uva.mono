import {createMessage} from "../dataModifyers/createMessage";
import {formatLanguageSpecificData}
  from "../dataModifyers/formatLanguageSpecificData";
import * as admin from "firebase-admin";
import axios from "axios";
import {logger} from "firebase-functions/v1";

export const sendToChannel =
 async (eventData: admin.firestore.DocumentData) => {
   const event = eventData;
   const formattedLanguageData =
       formatLanguageSpecificData(eventData.languageSpecificData);
   const message = createMessage(
     event,
     formattedLanguageData.description,
     formattedLanguageData.title,
     formattedLanguageData.eventPlace,
     formattedLanguageData.languageKeys
   );
   if (event.status === "active" && !event.telegramMessageId) {
     try {
       const response = await axios.post(
         `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
         {
           chat_id: process.env.TELEGRAM_CHANNEL_ID,
           caption: message,
           photo: eventData.imageUrl,
           parse_mode: "HTML",
         },
         {
           headers: {
             "Content-Type": "application/json",
           },
         }
       );

       await admin.firestore().collection("events").doc(event.id).update({
         telegramMessageId: response.data.result.message_id,
       });
     } catch (err) {
       logger.error(
         "Failed to send a message to Telegram with event details.",
         err
       );
     }
   }
 };
