import axios from 'axios';
import { firestore } from 'firebase-admin';
import { logger } from 'firebase-functions';
import { EventStatus } from 'uva-shared';
import { TG_CHANNEL_ID } from '../../../constants/env.js';
import { TelegramBotCommands } from '../../../constants/telegram.js';
import { getHeaders, getTgCommandUrl } from '../../../utils/axios.js';
import { createMessage } from '../dataModifyers/createMessage.js';
import { formatLanguageSpecificData } from '../dataModifyers/formatLanguageSpecificData.js';
import { sendToChannel } from './sendToChannel.js';

export const updatePublishedEvent = async (eventData: firestore.DocumentData) => {
  const event = eventData;
  const formattedLangData = formatLanguageSpecificData(eventData.languageSpecificData);
  const msg = createMessage(
    event,
    formattedLangData.description,
    formattedLangData.title,
    formattedLangData.eventPlace,
    formattedLangData.languageKeys,
  );

  try {
    if (!event.telegramMessageId && event.status === EventStatus.Active) {
      await sendToChannel(event);
    } else if (event.telegramMessageId && EventStatus.Active) {
      await axios.post(
        getTgCommandUrl(TelegramBotCommands.editMessageCaption),
        {
          chat_id: TG_CHANNEL_ID,
          message_id: eventData.telegramMessageId,
          caption: msg,
          parse_mode: 'HTML',
        },
        {
          headers: getHeaders(),
        },
      );
    }
  } catch (err) {
    logger.error('Failed to update existing post in channel.', err);
  }
};
