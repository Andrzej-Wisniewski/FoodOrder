export const CATEGORIES = Object.freeze([
  'Przystawka',
  'Zupa',
  'Danie główne',
  'Deser',
  'Napoje',
]);

export const ORDER_STATUS = Object.freeze({
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
});

export const PAYMENT_STATUS = Object.freeze({
  UNPAID: 'unpaid',
  PAID: 'paid',
  EXPIRED: 'expired',
  FAILED: 'failed',
  REFUNDED: 'refunded',
});

export const ROLES = Object.freeze({
  USER: 'user',
  ADMIN: 'admin',
});

export const STORAGE_KEYS = Object.freeze({
  AUTH_TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
});

export const VIEWS = Object.freeze({
  LOGIN: 'LOGIN',
  REGISTER: 'REGISTER',
  CART: 'CART',
  CHECKOUT: 'CHECKOUT',
  ORDERS: 'ORDERS',
  MEALS_ADMIN: 'MEALS_ADMIN',
  MEAL_CREATE: 'MEAL_CREATE',
  DOCUMENTATION: 'DOCUMENTATION',
});
