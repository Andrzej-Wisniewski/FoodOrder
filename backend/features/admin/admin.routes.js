import express from 'express';
import { requireAuth, requireAdmin } from '../../shared/middleware/auth.js';
import { upload } from '../../shared/middleware/upload.js';

import {
  getAdminMeals,
  createMeal,
  updateMeal,
  deleteMeal,
  uploadMealImage,
  getAllOrders,
  updateOrderStatus,
} from './admin.controller.js';

const router = express.Router();

router.get('/meals', requireAuth, requireAdmin, getAdminMeals);
router.post('/meals', requireAuth, requireAdmin, createMeal);
router.put('/meals/:id', requireAuth, requireAdmin, updateMeal);
router.put(
  '/meals/:id/image',
  requireAuth,
  requireAdmin,
  upload.single('image'),
  uploadMealImage,
);

router.delete('/meals/:id', requireAuth, requireAdmin, deleteMeal);

router.get('/orders', requireAuth, requireAdmin, getAllOrders);
router.put('/orders/:id/status', requireAuth, requireAdmin, updateOrderStatus);

export default router;
