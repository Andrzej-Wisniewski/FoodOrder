import { memo, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import Button from '../../ui/Button.jsx';

import styles from './CartItem.module.css';

const CartItem = memo(({ item, onIncrease, onDecrease }) => {
  const handleIncrease = useCallback(
    () => onIncrease(item.id),
    [onIncrease, item.id],
  );
  const handleDecrease = useCallback(
    () => onDecrease(item.id),
    [onDecrease, item.id],
  );

  return (
    <li className={styles.cartItem}>
      <p className={styles.itemName}>{item.name}</p>

      <div className={styles.actions}>
        <Button
          variant="primary"
          onClick={handleIncrease}
          aria-label="Zwiększ ilość"
        >
          <FontAwesomeIcon icon={faPlus} />
        </Button>

        <div className={styles.count}>{item.quantity}</div>

        <Button
          variant="primary"
          onClick={handleDecrease}
          aria-label="Zmniejsz ilość"
        >
          <FontAwesomeIcon icon={faMinus} />
        </Button>
      </div>
    </li>
  );
});

export default CartItem;
