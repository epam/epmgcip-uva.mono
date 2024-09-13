import axios from 'axios';
import admin from 'firebase-admin';
import { logger } from 'firebase-functions/v1';
import { EventStatus, FirebaseCollection } from 'uva-shared';
import { TG_CHANNEL_ID } from '../../../constants/env.js';
import { TelegramBotCommands } from '../../../constants/telegram.js';
import { getHeaders, getTgCommandUrl } from '../../../utils/axios.js';
import { createMessage } from '../dataModifyers/createMessage.js';
import { formatLanguageSpecificData } from '../dataModifyers/formatLanguageSpecificData.js';

export const sendToChannel = async (eventData: admin.firestore.DocumentData) => {
  const event = eventData;
  const formattedLanguageData = formatLanguageSpecificData(eventData.languageSpecificData);
  const message = createMessage(
    event,
    formattedLanguageData.description,
    formattedLanguageData.title,
    formattedLanguageData.eventPlace,
    formattedLanguageData.languageKeys,
  );
  if (event.status === EventStatus.Active && !event.telegramMessageId) {
    try {
      const response = await axios.post(
        getTgCommandUrl(TelegramBotCommands.sendPhoto),
        {
          chat_id: TG_CHANNEL_ID,
          caption: message,
          photo: eventData.imageUrl,
          parse_mode: 'HTML',
        },
        {
          headers: getHeaders(),
        },
      );

      await admin.firestore().collection(FirebaseCollection.Events).doc(event.id).update({
        telegramMessageId: response.data.result.message_id,
      });
    } catch (err) {
      logger.error('Failed to send a message to Telegram with event details.', err);
    }
  }
};
