import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { handleStripeWebhook } from './features/payments/payments.webhook.js';

import authRoutes from './features/auth/auth.routes.js';
import mealsRoutes from './features/meals/meals.routes.js';
import ordersRoutes from './features/orders/orders.routes.js';
import paymentsRoutes from './features/payments/payments.routes.js';
import adminRoutes from './features/admin/admin.routes.js';

import { setupSwagger } from './shared/utils/swagger.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);

app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  handleStripeWebhook,
);

app.use(express.json());

app.use(
  '/images',
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
  express.static('images'),
);

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentsRoutes);

setupSwagger(app);

export default app;
