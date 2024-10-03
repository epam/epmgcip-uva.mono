import * as functions from 'firebase-functions/v1';
import { logger } from 'firebase-functions';
import bot from './botController.js';

export const webhook = functions.https.onRequest(async (req, res) => {
  logger.info('Received update:', { body: req.body });
  try {
    await bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling update:', error);
    res.sendStatus(500);
  }
});
