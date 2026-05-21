import { useContext } from 'react';

import AuthContext from './context/AuthContext.jsx';
import ViewContext from './context/ViewContext.jsx';
import Button from '../ui/Button.jsx';

import { VIEWS } from '../shared/const/index.js';
import styles from './Footer.module.css';

const Footer = () => {
  const viewCtx = useContext(ViewContext);

  return (
    <footer className={styles.footer}>
      <div className={styles.footerActions}>
        <Button
          variant="header"
          onClick={() => viewCtx.openView(VIEWS.DOCUMENTATION)}
        >
          Dokumentacja techniczna
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
