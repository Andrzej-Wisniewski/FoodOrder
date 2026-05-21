import { useContext, useState, useCallback } from 'react';

import CartContext from '../../app/context/CartContext.jsx';
import AuthContext from '../../app/context/AuthContext.jsx';
import ViewContext from '../../app/context/ViewContext.jsx';
import ToastContext from '../../app/context/ToastContext.jsx';

import View from '../../ui/View.jsx';
import Input from '../../ui/Input.jsx';
import Button from '../../ui/Button.jsx';
import Loader from '../../ui/Loader.jsx';

import { createOrder } from '../../shared/api/orderApi.js';

import styles from './CheckoutView.module.css';

const validateCheckout = (customer) => {
  if (!customer.name?.trim()) return 'Podaj imię i nazwisko.';
  if (!customer.email?.trim()) return 'Podaj e-mail.';
  if (!customer.street?.trim()) return 'Podaj ulicę.';
  if (!customer.postalCode?.trim()) return 'Podaj kod pocztowy.';
  if (!customer.city?.trim()) return 'Podaj miasto.';
  return null;
};

const customerState = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  street: '',
  postalCode: '',
  city: '',
});

const CheckoutView = () => {
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const viewCtx = useContext(ViewContext);
  const toastCtx = useContext(ToastContext);

  const [isSending, setIsSending] = useState(false);
  const [customer, setCustomer] = useState(() => customerState(authCtx.user));

  const close = useCallback(() => {
    viewCtx.closeView();
  }, [viewCtx]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errMsg = validateCheckout(customer);
    if (errMsg) {
      toastCtx.showToast('error', errMsg);
      return;
    }

    setIsSending(true);

    try {
      const orderData = {
        customer: {
          name: customer.name.trim(),
          email: customer.email.trim(),
          street: customer.street.trim(),
          postalCode: customer.postalCode.trim(),
          city: customer.city.trim(),
        },
        items: cartCtx.items.map((item) => ({
          mealId: item.id,
          quantity: item.quantity,
        })),
      };

      await createOrder(orderData);

      cartCtx.clearCart();
      viewCtx.closeView();
      viewCtx.openSuccessModal();
    } catch (err) {
      toastCtx.showToast(
        'error',
        err.message || 'Nie udało się złożyć zamówienia.',
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View openView onClose={close}>
      <h2 className={styles.title}>Twoje dane</h2>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          name="name"
          label="Imię i nazwisko"
          autoComplete="name"
          value={customer.name}
          onChange={(e) =>
            setCustomer((prev) => ({ ...prev, name: e.target.value }))
          }
          required
          disabled={isSending}
        />
        <Input
          name="email"
          label="E-mail"
          type="email"
          autoComplete="email"
          value={customer.email}
          onChange={(e) =>
            setCustomer((prev) => ({ ...prev, email: e.target.value }))
          }
          required
          disabled={isSending}
        />
        <Input
          name="street"
          label="Ulica"
          autoComplete="street-address"
          value={customer.street}
          onChange={(e) =>
            setCustomer((prev) => ({ ...prev, street: e.target.value }))
          }
          required
          disabled={isSending}
        />

        <div className={styles.controlRow}>
          <Input
            name="postalCode"
            label="Kod pocztowy"
            autoComplete="postal-code"
            value={customer.postalCode}
            onChange={(e) =>
              setCustomer((prev) => ({ ...prev, postalCode: e.target.value }))
            }
            required
            disabled={isSending}
          />
          <Input
            name="city"
            label="Miasto"
            autoComplete="address-level2"
            value={customer.city}
            onChange={(e) =>
              setCustomer((prev) => ({ ...prev, city: e.target.value }))
            }
            required
            disabled={isSending}
          />
        </div>

        <div className={styles.actions}>
          <Button disabled={isSending} type="submit">
            {isSending ? <Loader size="sm" /> : 'Zamów'}
          </Button>
          <Button textOnly onClick={close} type="button" disabled={isSending}>
            Anuluj
          </Button>
        </div>
      </form>
    </View>
  );
};

export default CheckoutView;
