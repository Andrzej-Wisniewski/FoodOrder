import { httpClient } from './httpClient.js';

export async function createCheckoutSession(orderId) {
  return httpClient(`/api/payments/checkout/${orderId}`, {
    method: 'POST',
  });
}
