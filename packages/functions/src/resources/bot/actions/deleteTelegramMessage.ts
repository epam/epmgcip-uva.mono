import axios from 'axios';
import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions/v1';
import { TG_CHANNEL_ID } from '../../../constants/env.js';
import { TelegramBotCommands } from '../../../constants/telegram.js';
import { getHeaders, getTgCommandUrl } from '../../../utils/axios.js';

export const deleteTelegramMessage = async (eventData: admin.firestore.DocumentData) => {
  const telegramMessageId = eventData.telegramMessageId;
  try {
    await axios.post(
      getTgCommandUrl(TelegramBotCommands.deleteMessage),
      {
        chat_id: TG_CHANNEL_ID,
        message_id: telegramMessageId,
      },
      {
        headers: getHeaders(),
      },
    );
  } catch (err) {
    logger.error('Failed to delete message from Telegram', err);
  }
};
