import express from 'express';
import admin from 'firebase-admin';
import * as functions from 'firebase-functions/v1';
import { logger } from 'firebase-functions';
import { Change, onDocumentCreated, onDocumentUpdated, QueryDocumentSnapshot } from 'firebase-functions/v2/firestore';
import { checkAuthToken } from './middlewares/check-auth-token.js';
import authRouter from './resources/auth/auth.router.js';
import { deleteTelegramMessage } from './resources/bot/actions/deleteTelegramMessage.js';
import { sendToChannel } from './resources/bot/actions/sendToChannel.js';
import { updatePublishedEvent } from './resources/bot/actions/updatePublishedEvent.js';
import userRouter from './resources/user/user.router.js';
import { EventStatus } from 'uva-shared';
import { webhook } from './resources/bot/actions/webhookHandler.js';

export const webhookHandler = webhook;

admin.initializeApp();

const hoursToTrigger = 'every 240 hours';

export const scheduledEventStatusUpdate = functions.pubsub.schedule(hoursToTrigger).onRun(async () => {
  const now = new Date();

  try {
    const snapshot = await admin.firestore().collection('events').where('status', '==', 'active').get();

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

export const updatePublishedEventTrigger = onDocumentUpdated('events/{eventId}', async event => {
  try {
    const change = event.data as Change<QueryDocumentSnapshot>;

    const beforeData = change.before.data() as admin.firestore.DocumentData;
    const afterData = change.after.data() as admin.firestore.DocumentData;

    if (beforeData && afterData) {
      if (beforeData.status !== EventStatus.Canceled && afterData.status === EventStatus.Canceled) {
        await deleteTelegramMessage(afterData);
        return;
      }
    }

    if (JSON.stringify(beforeData) !== JSON.stringify(afterData)) {
      updatePublishedEvent(afterData);
    }
  } catch (err) {
    logger.error('Failed to update existing post in channel.', err);
  }
});

const app = express();

app.use('/auth', authRouter);
app.use('/user', checkAuthToken, userRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
  });
});

export const api = functions.https.onRequest(app);
