import { ORDER_STATUS, PAYMENT_STATUS } from '../const/index.js';

const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'W trakcie realizacji',
  [ORDER_STATUS.COMPLETED]: 'Zrealizowano',
  [ORDER_STATUS.CANCELLED]: 'Anulowano',
};

const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.UNPAID]: 'Oczekuje na płatność',
  [PAYMENT_STATUS.PAID]: 'Zamówienie opłacone',
  [PAYMENT_STATUS.EXPIRED]: 'Sesja płatności wygasła',
  [PAYMENT_STATUS.FAILED]: 'Płatność nie powiodła się',
  [PAYMENT_STATUS.REFUNDED]: 'Zwrot zrealizowany',
};

export function getOrderStatusLabel(status) {
  if (!status) return '—';
  return ORDER_STATUS_LABELS[status] || status;
}

export function getPaymentStatusLabel(status) {
  if (!status) return '—';
  return PAYMENT_STATUS_LABELS[status] || status;
}

export const ORDER_STATUS_VALUES = Object.keys(ORDER_STATUS_LABELS);
export const PAYMENT_STATUS_VALUES = Object.keys(PAYMENT_STATUS_LABELS);
