import { memo, useContext, useCallback } from 'react';

import CartContext from '../../app/context/CartContext';
import AuthContext from '../../app/context/AuthContext';

import Card from '../../ui/Card';
import Button from '../../ui/Button';

import { formatPrice } from '../../shared/utils/currency';
import { ROLES } from '../../shared/const/index';
import styles from './MealItem.module.css';

const apiBase = import.meta.env.VITE_API_URL || '';

const MealItem = memo(({ meal }) => {
  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);

  const isAdmin = authCtx.user?.role === ROLES.ADMIN;

  const addToCart = useCallback(() => {
    cartCtx.addItem(meal);
  }, [cartCtx, meal]);

  const imgBase = meal?.image;
  const srcBase = imgBase
    ? `${apiBase}/images/${imgBase.replace(/-\d+\.webp$/, '')}`
    : null;

  return (
    <Card className={styles.item}>
      {srcBase && (
        <img
          src={`${srcBase}-800.webp`}
          srcSet={`${srcBase}-400.webp 400w, ${srcBase}-600.webp 600w, ${srcBase}-800.webp 800w`}
          sizes="(max-width: 480px) 100vw, (max-width: 900px) 50vw, 400px"
          alt={meal.name ? `Zdjęcie ${meal.name}` : 'Zdjęcie dania'}
          loading="lazy"
          className={styles.image}
        />
      )}

      <h3 className={styles.title}>{meal.name}</h3>

      <p className={styles.price}>{formatPrice(meal.price)}</p>

      {meal.description && (
        <p className={styles.description}>{meal.description}</p>
      )}

      {!isAdmin && (
        <Button variant="primary" onClick={addToCart}>
          Dodaj do koszyka
        </Button>
      )}
    </Card>
  );
});

export default MealItem;
