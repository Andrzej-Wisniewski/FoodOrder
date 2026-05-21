import { useContext, useCallback } from 'react';

import ViewContext from '../app/context/ViewContext';

import View from './View.jsx';
import Button from './Button.jsx';

import { VIEWS } from '../shared/const/index.js';

import styles from './SuccessModal.module.css';

const SuccessModal = () => {
  const { openView, closeView, showSuccessModal, closeSuccessModal } =
    useContext(ViewContext);

  const close = useCallback(() => {
    closeSuccessModal();
    openView(VIEWS.ORDERS);
  }, [openView, closeSuccessModal]);

  if (!showSuccessModal) return null;

  return (
    <View openView onClose={close}>
      <h2 className={styles.title}>Zamówienie przyjęte!</h2>

      <p className={styles.message}>
        Twoje zamówienie zostało pomyślnie złożone. Możesz teraz przejść do
        zamówień i opłacić je.
      </p>

      <div className={styles.actions}>
        <Button onClick={closeView}>Przejdź do zamówień</Button>
      </div>
    </View>
  );
};

export default SuccessModal;
