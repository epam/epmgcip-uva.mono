import { Router } from 'express';
import admin from 'firebase-admin';
import { logger } from 'firebase-functions/v1';
import { FirebaseCollection, getUserDocId, IUser, UserStatus } from 'uva-shared';
import { allowedRoles } from '../../constants/auth.js';
import { AUTH_SPECIAL_USER_USERNAMES } from '../../constants/env.js';
import { checkSignature } from '../../utils/auth.js';

const router = Router();

router.post('/auth-tg', async (req, res) => {
  try {
    const { id, hash, auth_date, username } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    // verify input
    const currentTime = Math.floor(Date.now() / 1000);
    // todo: get timezones into account and check || auth_date > currentTime
    if (!hash || !auth_date || !id || !username) {
      logger.info('Invalid request', id, auth_date, username, hash);
      logger.error('Invalid request', req.body);
      res.status(400).json({ message: 'Invalid request' });
      return;
    }

    // todo: take into account timezones, now it's 4 hours because of server-client time difference
    if (auth_date < currentTime - 4 * 3600 * 1000) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }

    // check telegram signature, skipping for special users for local auth
    const isValid = AUTH_SPECIAL_USER_USERNAMES.includes(username)
      ? true
      : checkSignature(req.body);
    if (!isValid) {
      res.status(401).json({ message: 'Invalid signature' });
      return;
    }

    // check user in db
    const telegramName = `@${username}`;
    let userData: IUser;
    let userId;
    const dbUsers = admin.firestore().collection(FirebaseCollection.Users);

    const userDocId = getUserDocId(telegramName);
    const docRef = dbUsers.doc(userDocId);

    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      userData = docSnapshot.data() as IUser;
      userId = docSnapshot.id;
    } else {
      const querySnapshot = await dbUsers.where('telegramId', '==', id).get();

      if (querySnapshot.empty) {
        logger.error('User not found', telegramName);
        res.status(403).send({ message: 'Forbidden' });
        return;
      }

      userData = querySnapshot.docs[0].data() as IUser;
      userId = querySnapshot.docs[0].id;
    }

    if (!userData) {
      logger.error('User not found', telegramName);
      res.status(403).send({ message: 'Forbidden' });
      return;
    }

    if (userData.status !== UserStatus.Active || !allowedRoles.includes(userData.role)) {
      logger.error('Access is forbidden for user', userData);
      res.status(403).send({ message: 'Forbidden' });
      return;
    }

    // create custom token
    const additionalClaims = { role: userData.role, status: userData.status };

    const token = await admin.auth().createCustomToken(userId, additionalClaims);

    logger.info('User authenticated', {
      telegramName,
      userId,
      role: userData.role,
      status: userData.status,
    });
    res.status(200).json({ token });
  } catch (error) {
    logger.error('Failed to check authorization', error);
    logger.error('Input data:', req.body);
    res.status(401).send(error);
  }
});

export default router;
