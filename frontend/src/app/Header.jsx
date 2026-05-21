import { useContext, useCallback } from 'react';

import CartContext from './context/CartContext.jsx';
import ViewContext from './context/ViewContext.jsx';
import AuthContext from './context/AuthContext.jsx';

import Button from '../ui/Button.jsx';

import { VIEWS, ROLES } from '../shared/const/index.js';

import styles from './Header.module.css';

const Header = () => {
  const cartCtx = useContext(CartContext);
  const viewCtx = useContext(ViewContext);
  const authCtx = useContext(AuthContext);

  const handleShow = useCallback(
    (screen) => viewCtx.openView(screen),
    [viewCtx],
  );

  const isAdmin = authCtx.user?.role === ROLES.ADMIN;

  return (
    <header className={styles.header}>
      <h1 className={styles.title}>FoodOrder</h1>

      <nav className={styles.nav}>
        {!authCtx.isLogged && (
          <>
            <Button variant="header" onClick={() => handleShow(VIEWS.LOGIN)}>
              Zaloguj
            </Button>

            <Button variant="header" onClick={() => handleShow(VIEWS.REGISTER)}>
              Rejestracja
            </Button>
          </>
        )}

        {authCtx.isLogged && (
          <>
            <Button variant="header" onClick={() => handleShow(VIEWS.ORDERS)}>
              Zamówienia
            </Button>

            <Button variant="header" onClick={authCtx.logout}>
              Wyloguj
            </Button>
          </>
        )}

        {isAdmin ? (
          <Button
            variant="header"
            onClick={() => handleShow(VIEWS.MEALS_ADMIN)}
          >
            Menu
          </Button>
        ) : (
          <Button variant="header" onClick={() => handleShow(VIEWS.CART)}>
            Koszyk
            {cartCtx.totalItems > 0 && ` (${cartCtx.totalItems})`}
          </Button>
        )}
      </nav>
    </header>
  );
};

export default Header;
