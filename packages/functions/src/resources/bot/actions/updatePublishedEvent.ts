import {createMessage} from "../dataModifyers/createMessage";
import {formatLanguageSpecificData}
  from "../dataModifyers/formatLanguageSpecificData";
import {sendToChannel} from "./sendToChannel";
import * as admin from "firebase-admin";
import axios from "axios";

export const updatePublishedEvent = async (
  eventData: admin.firestore.DocumentData
) => {
  const event = eventData;
  const formattedLangData =
     formatLanguageSpecificData(eventData.languageSpecificData);
  const msg =
     createMessage(
       event,
       formattedLangData.description,
       formattedLangData.title,
       formattedLangData.eventPlace,
       formattedLangData.languageKeys
     );

  try {
    if (!event.telegramMessageId && event.status === "active") {
      await sendToChannel(event);
    } else if (event.telegramMessageId && event.status === "active") {
      await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageCaption`,
        {
          chat_id: process.env.TELEGRAM_CHANNEL_ID,
          message_id: eventData.telegramMessageId,
          caption: msg,
          parse_mode: "HTML",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  } catch (error) {
    return;
  }
};
