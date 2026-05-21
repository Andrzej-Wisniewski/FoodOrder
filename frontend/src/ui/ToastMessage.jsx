import { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleCheck,
  faCircleExclamation,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import styles from './ToastMessage.module.css';

const ICONS = {
  success: faCircleCheck,
  error: faCircleExclamation,
  info: faCircleInfo,
};

const TITLES = {
  success: 'Sukces',
  error: 'Błąd',
  info: 'Informacja',
};

const ToastMessage = memo(({ toast, onClose }) => {
  const { type, message } = toast;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.header}>
        <span className={styles.icon}>
          <FontAwesomeIcon icon={ICONS[type]} />
        </span>
        <h2 className={styles.title}>{TITLES[type]}</h2>
      </div>

      <p className={styles.text}>{message}</p>

      <div className={styles.actions}>
        <button className={styles.button} onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
});

export default ToastMessage;
