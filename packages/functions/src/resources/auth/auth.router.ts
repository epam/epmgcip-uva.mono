import { Router } from 'express';
import admin from 'firebase-admin';
import { logger } from 'firebase-functions/v1';
import { FirebaseCollection, getUserDocId } from 'uva-shared';
import { checkSignature } from '../../utils/auth.js';
import { AUTH_SPECIAL_USER_USERNAMES } from '../../constants/env.js';
import { allowedRoles } from '../../constants/auth.js';

const router = Router();

router.post('/auth-tg', async (req, res) => {
  const { id, hash, auth_date, username } = req.body;
  try {
    // verify input
    const currentTime = Math.floor(Date.now() / 1000);

    if (!hash || !auth_date || !id || !username || auth_date > currentTime) {
      res.status(400).json({ message: 'Invalid request' });
      return;
    }

    if (auth_date < currentTime - 3600 * 1000) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }

    // check telegram signature, skipping for special users for local auth
    const isValid = AUTH_SPECIAL_USER_USERNAMES.includes(username) ? true : checkSignature(req.body);
    if (!isValid) {
      res.status(401).json({ message: 'Invalid signature' });
      return;
    }

    // check user in db
    const telegramName = `@${username}`;
    let userData;
    let userId;
    const dbUsers = admin.firestore().collection(FirebaseCollection.Users);

    const userDocId = getUserDocId(telegramName);
    const docRef = dbUsers.doc(userDocId);

    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      userData = docSnapshot.data();
      userId = docSnapshot.id;
    } else {
      const querySnapshot = await dbUsers.where('telegramId', '==', id).get();

      if (querySnapshot.empty) {
        res.status(403).send({ message: 'Forbidden' });
        return;
      }

      userData = querySnapshot.docs[0].data();
      userId = querySnapshot.docs[0].id;
    }

    if (!userData) {
      res.status(403).send({ message: 'Forbidden' });
      return;
    }

    if (!userData.active || !allowedRoles.includes(userData.role)) {
      res.status(403).send({ message: 'Forbidden' });
      return;
    }

    // create custom token
    const additionalClaims = { role: userData.role, status: userData.status };

    const token = admin.auth().createCustomToken(userId, additionalClaims);

    logger.info('User authenticated', {
      telegramName,
      userId,
      role: userData.role,
      status: userData.status,
    });
    res.status(200).json({ token });
  } catch (error) {
    logger.error('Failed to check authorization', error);
    logger.error('Input data:', id, auth_date, username);
    res.status(401).send(error);
  }
});

export default router;
