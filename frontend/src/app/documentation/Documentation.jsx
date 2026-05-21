import { useContext, useCallback } from 'react';
import View from '../../ui/View.jsx';
import Button from '../../ui/Button';
import ReactMarkdown from 'react-markdown';
import ViewContext from '../context/ViewContext.jsx';
import styles from './Documentation.module.css';
import content from './documentation.md?raw';

const Documentation = () => {
  const { closeView } = useContext(ViewContext);

  const close = useCallback(() => {
    closeView();
  }, [closeView]);

  return (
    <View openView onClose={close}>
      <div className={styles.doc}>
        <ReactMarkdown>{content}</ReactMarkdown>
        <div className={styles.actions}>
          <Button variant="primary" onClick={closeView}>
            Zamknij
          </Button>
        </div>
      </div>
    </View>
  );
};

export default Documentation;
