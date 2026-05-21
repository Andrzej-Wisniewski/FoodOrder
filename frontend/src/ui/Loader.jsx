import { memo } from 'react';
import styles from './Loader.module.css';

const Loader = memo(({ size = 'md' }) => {
  return <div className={styles.loader} />;
});

export default Loader;
