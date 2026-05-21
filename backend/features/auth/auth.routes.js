import express from 'express';
import { registerUser, loginUser, getCurrentUser } from './auth.controller.js';

import { requireAuth } from '../../shared/middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

router.get('/current', requireAuth, getCurrentUser);

export default router;
