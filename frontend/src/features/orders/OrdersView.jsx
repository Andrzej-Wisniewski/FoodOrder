import { useContext, useEffect, useState, useCallback } from 'react';

import AuthContext from '../../app/context/AuthContext.jsx';
import ViewContext from '../../app/context/ViewContext.jsx';
import ToastContext from '../../app/context/ToastContext.jsx';

import View from '../../ui/View.jsx';
import Loader from '../../ui/Loader.jsx';
import Button from '../../ui/Button.jsx';

import ClientOrderItem from './ClientOrderItem.jsx';
import AdminOrderItem from './AdminOrderItem.jsx';

import { ROLES } from '../../shared/const/index.js';
import {
  fetchOrders,
  fetchAdminOrders,
  updateOrderStatus,
  cancelOrder,
} from '../../shared/api/orderApi.js';

import styles from './OrdersView.module.css';

const OrdersView = () => {
  const authtx = useContext(AuthContext);
  const viewCtx = useContext(ViewContext);
  const toastCtx = useContext(ToastContext);

  const isAdmin = authtx.user?.role === ROLES.ADMIN;

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authtx.token) return;

    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const fetcher = isAdmin ? fetchAdminOrders : fetchOrders;
        const data = await fetcher();
        setOrders(data);
      } catch (err) {
        toastCtx.showToast(
          'error',
          err.message || 'Nie udało się pobrać zamówień.',
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, [authtx.token, isAdmin, toastCtx]);

  const saveStatus = useCallback(
    async (orderId, newStatus) => {
      try {
        const updated = await updateOrderStatus(orderId, newStatus);
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? updated : order)),
        );
        toastCtx.showToast('success', 'Status zapisany.');
      } catch (err) {
        toastCtx.showToast(
          'error',
          err.message || 'Nie udało się zmienić statusu.',
        );
        throw err;
      }
    },
    [toastCtx],
  );

  const handleCancel = useCallback(
    async (orderId) => {
      const confirmed = window.confirm(
        'Czy na pewno chcesz anulować to zamówienie?',
      );
      if (!confirmed) return;

      try {
        const updated = await cancelOrder(orderId);
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? updated : order)),
        );
      } catch (err) {
        toastCtx.showToast(
          'error',
          err.message || 'Nie udało się anulować zamówienia.',
        );
      }
    },
    [toastCtx],
  );

  return (
    <View openView onClose={close}>
      <h2 className={styles.title}>
        {isAdmin ? 'Wszystkie zamówienia' : 'Twoje zamówienia'}
      </h2>

      {isLoading && (
        <div className={styles.loaderWrapper}>
          <Loader size="md" />
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <p className={styles.empty}>Brak zamówień.</p>
      )}

      {!isLoading && orders.length > 0 && (
        <div className={styles.body}>
          <ul className={styles.ordersList}>
            {orders.map((order) =>
              isAdmin ? (
                <AdminOrderItem
                  key={order.id}
                  order={order}
                  onSaveStatus={saveStatus}
                />
              ) : (
                <ClientOrderItem
                  key={order.id}
                  order={order}
                  onCancel={handleCancel}
                />
              ),
            )}
          </ul>
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="primary" onClick={viewCtx.closeView}>
          Zamknij
        </Button>
      </div>
    </View>
  );
};

export default OrdersView;
