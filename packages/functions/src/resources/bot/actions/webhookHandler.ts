import * as functions from 'firebase-functions/v1';
import bot from './botController.js';

export const webhook = functions.https.onRequest(async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error handling update:', error);
    res.sendStatus(500);
  }
});
