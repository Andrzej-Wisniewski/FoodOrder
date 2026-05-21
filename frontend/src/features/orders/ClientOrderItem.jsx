import Card from '../../ui/Card.jsx';
import Button from '../../ui/Button.jsx';
import PayButton from '../payments/PayButton.jsx';

import { formatPrice } from '../../shared/utils/currency.js';
import {
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from '../../shared/utils/status.js';

import { ORDER_STATUS, PAYMENT_STATUS } from '../../shared/const/index.js';

import styles from './ClientOrderItem.module.css';

const ClientOrderItem = ({ order, onCancel }) => {
  const canPay = order.paymentStatus === PAYMENT_STATUS.UNPAID;
  const canCancel =
    order.status === ORDER_STATUS.PENDING &&
    order.paymentStatus === PAYMENT_STATUS.UNPAID;

  return (
    <Card className={styles.orderItem}>
      <h3>{new Date(order.createdAt)}</h3>

      <p>
        Status realizacji: <strong>{getOrderStatusLabel(order.status)}</strong>
      </p>

      <p>
        Płatność: <strong>{getPaymentStatusLabel(order.paymentStatus)}</strong>
      </p>

      <p>Kwota: {formatPrice(order.totalPrice)}</p>

      <ul className={styles.itemsList}>
        {order.items.map((item) => (
          <li key={item.mealId}>
            {item.quantity}× {item.name} ({formatPrice(item.price)})
          </li>
        ))}
      </ul>

      {(canPay || canCancel) && (
        <div className={styles.actions}>
          {canPay && <PayButton orderId={order.id} />}
          {canCancel && onCancel && (
            <Button type="button" textOnly onClick={() => onCancel(order.id)}>
              Anuluj zamówienie
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};

export default ClientOrderItem;
