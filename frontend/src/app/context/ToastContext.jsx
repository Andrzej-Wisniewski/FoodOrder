import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { createPortal } from 'react-dom';
import ToastMessage from '../../ui/ToastMessage.jsx';

const TOAST_DURATION = 3000;

const ToastContext = createContext({
  toast: null,
  showToast: () => {},
  hideToast: () => {},
});

export const ToastContextProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast]);

  const toastCtxValue = useMemo(
    () => ({ toast, showToast, hideToast }),
    [toast, showToast, hideToast],
  );

  const toastLayer = document.getElementById('toast-layer');

  return (
    <ToastContext.Provider value={toastCtxValue}>
      {children}

      {createPortal(
        <div className="toast-container">
          {toast && <ToastMessage toast={toast} onClose={hideToast} />}
        </div>,
        toastLayer,
      )}
    </ToastContext.Provider>
  );
};

export default ToastContext;
