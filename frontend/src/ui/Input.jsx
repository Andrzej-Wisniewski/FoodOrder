import { useId, memo } from 'react';
import styles from './Input.module.css';

const Input = memo(
  ({ label, id, name, type = 'text', autoComplete, ...props }) => {
    const reactId = useId();
    const inputId = id || reactId;

    let ac = autoComplete;
    if (!ac) {
      if (type === 'email') ac = 'email';
      else if (type === 'password') ac = 'current-password';
      else ac = 'off';
    }

    return (
      <div className={styles.control}>
        {label && <label htmlFor={inputId}>{label}</label>}
        <input
          id={inputId}
          name={name || inputId}
          type={type}
          autoComplete={ac}
          className={styles.input}
          {...props}
        />
      </div>
    );
  },
);

export default Input;
