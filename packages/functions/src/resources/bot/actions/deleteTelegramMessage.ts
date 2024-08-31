import * as admin from "firebase-admin";
import axios from "axios";
import {logger} from "firebase-functions/v1";

export const deleteTelegramMessage =
async (eventData: admin.firestore.DocumentData) => {
  const telegramMessageId = eventData.telegramMessageId;
  try {
    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/deleteMessage`,
      {
        chat_id: process.env.TELEGRAM_CHANNEL_ID,
        message_id: telegramMessageId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    logger.error("Failed to delete message from Telegram", err);
  }
};
