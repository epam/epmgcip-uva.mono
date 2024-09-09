import express from 'express';
import * as functions from 'firebase-functions';
import { checkAuthToken } from './middlewares/check-auth-token';
import authRouter from './resources/auth/auth.router';
import userRouter from './resources/user/user.router';
import * as admin from 'firebase-admin';
import {
  Change,
  onDocumentCreated,
  onDocumentUpdated,
  QueryDocumentSnapshot,
} from 'firebase-functions/v2/firestore';
import { updatePublishedEvent } from './resources/bot/actions/updatePublishedEvent';
import { sendToChannel } from './resources/bot/actions/sendToChannel';
import { deleteTelegramMessage } from './resources/bot/actions/deleteTelegramMessage';
import { logger } from 'firebase-functions';
import TelegramBot from 'node-telegram-bot-api';

admin.initializeApp();

const hoursToTrigger = 'every 240 hours';

export const scheduledEventStatusUpdate = functions.pubsub
  .schedule(hoursToTrigger)
  .onRun(async () => {
    const now = new Date();

    try {
      const snapshot = await admin
        .firestore()
        .collection('events')
        .where('status', '==', 'active')
        .get();

      if (snapshot.empty) {
        logger.error('No active events to update.');
        return null;
      }

      const batch = admin.firestore().batch();
      snapshot.forEach(doc => {
        const eventData = doc.data();
        const eventEndDate = new Date(eventData.endDate);

        if (eventEndDate <= now) {
          batch.update(doc.ref, { status: 'completedEvent' });
        }
      });

      await batch.commit();
      logger.info('Active events statuses updated to "completedEvent".');
    } catch (error) {
      logger.error('Error updating event statuses:', error);
    }

    return null;
  });

export const publishToTelegram = onDocumentCreated('events/{eventId}', async event => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.error('No data associated with the event');
    return;
  }
  try {
    const data = snapshot.data();
    await sendToChannel(data);
  } catch (err) {
    logger.error('Unable to send post to channel', err);
  }
});

export const deleteEventFromTelegram = onDocumentUpdated('events/{eventId}', async event => {
  const beforeData = event.data?.before.data();
  const afterData = event.data?.after.data();

  if (beforeData && afterData) {
    if (beforeData.status !== 'canceled' && afterData.status === 'canceled') {
      await deleteTelegramMessage(afterData);
    }
  }
});

export const updatePublishedEventTrigger = onDocumentUpdated('events/{eventId}', event => {
  const change = event.data as Change<QueryDocumentSnapshot>;

  const beforeData = change.before.data() as admin.firestore.DocumentData;
  const afterData = change.after.data() as admin.firestore.DocumentData;

  if (JSON.stringify(beforeData) !== JSON.stringify(afterData)) {
    updatePublishedEvent(afterData);
  }
});

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN!, { polling: true });
const registrationUrl = 'https://core.telegram.org/bots/webapps';

const sendRegistrationMessage = async (chatId: TelegramBot.ChatId) => {
  try {
    await bot.sendMessage(chatId, 'Click the button below to register:', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Register',
              web_app: { url: registrationUrl },
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.error(`Failed to send registration message: ${error}`);
  }
};

bot.onText(/\/register/, async msg => {
  const chatId = msg.chat.id;
  await sendRegistrationMessage(chatId);
});

const app = express();

app.use('/auth', authRouter);
app.use('/user', checkAuthToken, userRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

exports.api = functions.https.onRequest(app);
