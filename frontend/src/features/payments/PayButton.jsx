import { useContext, useState } from 'react';
import { createCheckoutSession } from '../../shared/api/payments.js';

import Button from '../../ui/Button.jsx';
import Loader from '../../ui/Loader.jsx';

import styles from './PayButton.module.css';
import ToastContext from '../../app/context/ToastContext.jsx';

const STRIPE_CHECKOUT_PREFIX = 'https://checkout.stripe.com/';

const PayButton = ({ orderId }) => {
  const [isSending, setIsSending] = useState(false);
  const toastCtx = useContext(ToastContext);

  const handlePay = async () => {
    if (isSending) return;

    setIsSending(true);

    try {
      const { checkoutUrl } = await createCheckoutSession(orderId);

      if (
        typeof checkoutUrl !== 'string' ||
        !checkoutUrl.startsWith(STRIPE_CHECKOUT_PREFIX)
      ) {
        throw new Error('Nieprawidłowy adres płatności.');
      }

      window.location.href = checkoutUrl;
    } catch (err) {
      toastCtx.showToast(
        'error',
        err.message || 'Nie udało się rozpocząć płatności.',
      );
      setIsSending(false);
    }
  };

  return (
    <div className={styles.pay}>
      <Button onClick={handlePay} disabled={isSending}>
        {isSending ? <Loader size="sm" /> : 'Opłać zamówienie'}
      </Button>
    </div>
  );
};

export default PayButton;
