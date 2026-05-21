import { httpClient } from './httpClient.js';
import { normalizeId } from '../utils/normalizeId.js';

const normalizeOrder = (order) => ({
  ...normalizeId(order),
  userId:
    order.userId && typeof order.userId === 'object'
      ? normalizeId(order.userId)
      : order.userId,
});

export const fetchOrders = async () => {
  const data = await httpClient.get('/api/orders');
  return data.map(normalizeOrder);
};

export const fetchAdminOrders = async () => {
  const data = await httpClient.get('/api/admin/orders');
  return data.map(normalizeOrder);
};

export const createOrder = async (orderData) => {
  const data = await httpClient.post('/api/orders', orderData);
  return normalizeOrder(data);
};

export const updateOrderStatus = async (id, status) => {
  const data = await httpClient.put(`/api/admin/orders/${id}/status`, {
    status,
  });
  return normalizeOrder(data);
};

export const cancelOrder = async (id) => {
  const data = await httpClient.put(`/api/orders/${id}/cancel`);
  return normalizeOrder(data);
};
