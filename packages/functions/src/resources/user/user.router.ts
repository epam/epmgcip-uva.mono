import { Router } from 'express';

const router = Router();

router.post('/register', (req, res) =>
  res.status(200).json({
    status: 'register user',
  }),
);

router.get('/profile', (req, res) =>
  res.status(200).json({
    status: 'get user profile',
  }),
);

router.put('/profile', (req, res) =>
  res.status(200).json({
    status: 'update user profile',
  }),
);

export default router;
