import express from 'express';
import { requireAuth } from '../../shared/middleware/auth.js';
import { createCheckoutSession } from './payments.controller.js';

const router = express.Router();

router.post('/checkout/:orderId', requireAuth, createCheckoutSession);

export default router;
