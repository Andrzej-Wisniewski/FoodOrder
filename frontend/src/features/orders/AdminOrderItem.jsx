import { useState } from 'react';

import Card from '../../ui/Card.jsx';
import Button from '../../ui/Button.jsx';

import { formatPrice } from '../../shared/utils/currency.js';
import { formatLongDate } from '../../shared/utils/formatDate.js';
import {
  getOrderStatusLabel,
  getPaymentStatusLabel,
  ORDER_STATUS_VALUES,
} from '../../shared/utils/status.js';

import styles from './AdminOrderItem.module.css';

const AdminOrderItem = ({ order, onSaveStatus }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order.status);
  const [isSaving, setIsSaving] = useState(false);

  const startEdit = () => {
    setSelectedStatus(order.status);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  const saveStatus = async () => {
    if (selectedStatus === order.status) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSaveStatus(order.id, selectedStatus);
      setIsEditing(false);
    } catch {
      // toast pokazany w rodzicu
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card
      className={`${styles.orderItem} ${isEditing ? styles.adminEdit : ''}`}
    >
      <h3>{formatLongDate(order.createdAt)}</h3>

      {order.userId && typeof order.userId === 'object' && (
        <p className={styles.customerInfo}>
          Klient: <strong>{order.userId.name}</strong> ({order.userId.email})
        </p>
      )}

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

      {!isEditing ? (
        <div className={styles.actions}>
          <Button onClick={startEdit}>Edytuj status</Button>
        </div>
      ) : (
        <>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.statusSelect}
            disabled={isSaving}
          >
            {ORDER_STATUS_VALUES.map((statusKey) => (
              <option key={statusKey} value={statusKey}>
                {getOrderStatusLabel(statusKey)}
              </option>
            ))}
          </select>

          <div className={styles.actions}>
            <Button onClick={saveStatus} disabled={isSaving}>
              {isSaving ? 'Zapisywanie...' : 'Zapisz'}
            </Button>
            <Button textOnly onClick={cancelEdit} disabled={isSaving}>
              Anuluj
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default AdminOrderItem;
