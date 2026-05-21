import express from 'express';
import { requireAuth } from '../../shared/middleware/auth.js';
import {
  createOrder,
  getUserOrders,
  cancelOrder,
} from './orders.controller.js';

const router = express.Router();

router.get('/', requireAuth, getUserOrders);
router.post('/', requireAuth, createOrder);
router.put('/:id/cancel', requireAuth, cancelOrder);

export default router;
