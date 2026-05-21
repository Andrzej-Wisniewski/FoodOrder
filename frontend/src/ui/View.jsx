import { useEffect, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import styles from './View.module.css';

const View = memo(({ openView, onClose, children, className = '' }) => {
  const handleInnerClick = useCallback((e) => e.stopPropagation(), []);

  useEffect(() => {
    if (!openView) return;

    document.body.style.overflow = openView ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [openView]);

  useEffect(() => {
    if (!openView) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openView, onClose]);

  if (!openView) return null;

  const layer = document.getElementById('View-layer');
  if (!layer) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.View} ${className}`} onClick={handleInnerClick}>
        {children}
      </div>
    </div>,
    layer,
  );
});

export default View;
