import { memo } from 'react';
import styles from './Button.module.css';

const Button = memo(
  ({
    children,
    variant = 'primary',
    type = 'button',
    className = '',
    textOnly = false,
    ...rest
  }) => {
    const finalVariant = textOnly ? 'text' : variant;

    let variantClass = styles.primary;

    if (finalVariant === 'header') {
      variantClass = styles.header;
    } else if (finalVariant === 'text') {
      variantClass = styles.text;
    }

    const classes = `${styles.btn} ${variantClass} ${className}`;

    return (
      <button type={type} className={classes} {...rest}>
        {children}
      </button>
    );
  },
);

export default Button;
