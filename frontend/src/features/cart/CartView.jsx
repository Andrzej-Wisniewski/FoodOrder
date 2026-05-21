import { useContext, useCallback } from 'react';

import CartContext from '../../app/context/CartContext.jsx';
import AuthContext from '../../app/context/AuthContext.jsx';
import ViewContext from '../../app/context/ViewContext.jsx';
import ToastContext from '../../app/context/ToastContext.jsx';

import View from '../../ui/View.jsx';
import Button from '../../ui/Button.jsx';
import CartItem from './CartItem.jsx';

import { VIEWS } from '../../shared/const/index.js';
import { formatPrice } from '../../shared/utils/currency.js';

import styles from './CartView.module.css';

const CartView = () => {
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const viewCtx = useContext(ViewContext);
  const toastCtx = useContext(ToastContext);

  const isEmpty = cartCtx.items.length === 0;

  const goToCheckout = useCallback(() => {
    if (isEmpty) {
      toastCtx.showToast('info', 'Koszyk jest pusty.');
      return;
    }

    if (!authCtx.isLogged) {
      toastCtx.showToast('info', 'Musisz się zalogować.');
      viewCtx.openWithIntent(VIEWS.LOGIN, VIEWS.CART);
      return;
    }

    viewCtx.openView(VIEWS.CHECKOUT);
  }, [isEmpty, authCtx.isLogged, viewCtx, toastCtx]);

  const increase = useCallback((id) => cartCtx.incrementItem(id), [cartCtx]);
  const decrease = useCallback((id) => cartCtx.removeItem(id), [cartCtx]);

  return (
    <View openView onClose={viewCtx.closeView}>
      <h2>Koszyk {authCtx.user?.name || ''}</h2>

      {isEmpty ? (
        <p className={styles.empty}>Koszyk jest pusty.</p>
      ) : (
        <>
          <ul className={styles.itemsList}>
            {cartCtx.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={increase}
                onDecrease={decrease}
              />
            ))}
          </ul>

          <p className={styles.totalPrice}>{formatPrice(cartCtx.totalPrice)}</p>
        </>
      )}

      <div className={styles.actions}>
        <Button type="button" onClick={goToCheckout} disabled={isEmpty}>
          Przejdź do kasy
        </Button>
        <Button textOnly onClick={viewCtx.closeView}>
          Zamknij
        </Button>
      </div>
    </View>
  );
};

export default CartView;
