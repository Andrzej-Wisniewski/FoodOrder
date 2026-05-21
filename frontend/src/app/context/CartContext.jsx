import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';

import { useLocalStorage } from '../../shared/hooks/useLocalStorage.js';
import { STORAGE_KEYS } from '../../shared/const/index.js';

import ToastContext from './ToastContext.jsx';
import AuthContext from './AuthContext.jsx';

const CartContext = createContext({
  items: [],
  addItem: () => {},
  incrementItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  totalItems: 0,
  totalPrice: 0,
});

export const CartContextProvider = ({ children }) => {
  const [items, setItems] = useLocalStorage(STORAGE_KEYS.CART, []);
  const toastCtx = useContext(ToastContext);
  const authCtx = useContext(AuthContext);

  const wasLoggedRef = useRef(authCtx.isLogged);

  useEffect(() => {
    const wasLogged = wasLoggedRef.current;
    const isLogged = authCtx.isLogged;

    if (wasLogged && !isLogged && items.length > 0) {
      setItems([]);
    }

    wasLoggedRef.current = isLogged;
  }, [authCtx.isLogged, items.length, setItems]);

  const addItem = useCallback(
    (meal) => {
      const id = meal?.id;

      if (!id) {
        toastCtx.showToast('error', 'Nie udało się dodać do koszyka.');
        return;
      }

      const price = Number(meal.price);
      if (Number.isNaN(price) || price <= 0) {
        toastCtx.showToast('error', 'Nie udało się dodać do koszyka.');
        return;
      }

      setItems((prev) => {
        const existing = prev.find((item) => item.id === id);

        if (existing) {
          return prev.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
          );
        }

        return [
          ...prev,
          {
            id,
            name: meal.name,
            price,
            quantity: 1,
          },
        ];
      });
    },
    [toastCtx, setItems],
  );

  const incrementItem = useCallback(
    (id) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
        ),
      );
    },
    [setItems],
  );

  const removeItem = useCallback(
    (id) => {
      setItems((prev) =>
        prev
          .map((item) =>
            item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
          )
          .filter((item) => item.quantity > 0),
      );
    },
    [setItems],
  );

  const clearCart = useCallback(() => setItems([]), [setItems]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const cartCtxValue = useMemo(
    () => ({
      items,
      addItem,
      incrementItem,
      removeItem,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [
      items,
      addItem,
      incrementItem,
      removeItem,
      clearCart,
      totalItems,
      totalPrice,
    ],
  );

  return (
    <CartContext.Provider value={cartCtxValue}>{children}</CartContext.Provider>
  );
};

export default CartContext;
