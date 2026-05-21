import { useContext, useState, useCallback } from 'react';

import AuthContext from '../../app/context/AuthContext.jsx';
import ViewContext from '../../app/context/ViewContext.jsx';

import View from '../../ui/View.jsx';
import Input from '../../ui/Input.jsx';
import Button from '../../ui/Button.jsx';
import Loader from '../../ui/Loader.jsx';

import { VIEWS } from '../../shared/const/index.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import styles from './LoginView.module.css';

const LoginView = () => {
  const authContext = useContext(AuthContext);
  const viewCtx = useContext(ViewContext);

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const close = useCallback(() => {
    setForm({ email: '', password: '' });
    viewCtx.closeView();
  }, [viewCtx]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  async function submit(e) {
    e.preventDefault();
    setIsSending(true);

    try {
      await authContext.login(form.email, form.password);
      viewCtx.resolveIntent();
    } catch {
      // powiadomienie z AuthContext
    } finally {
      setIsSending(false);
    }
  }

  return (
    <View openView onClose={close}>
      <h2 className={styles.title}>Logowanie</h2>

      <div className={styles.formContainer}>
        <form onSubmit={submit} className={styles.form}>
          <Input
            label="E-mail"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            required
            disabled={isSending}
          />

          <div className={styles.passwordField}>
            <Input
              label="Hasło"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              required
              disabled={isSending}
            />
            <button
              type="button"
              className={styles.toggleVisibility}
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Ukryj hasło' : 'Pokaż hasło'}
              disabled={isSending}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <div className={styles.actions}>
            <Button disabled={isSending} type="submit">
              {isSending ? <Loader size="sm" /> : 'Zaloguj'}
            </Button>
            <Button textOnly type="button" onClick={close} disabled={isSending}>
              Anuluj
            </Button>
          </div>

          <p className={styles.switchAuth}>
            Nie masz konta?{' '}
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => viewCtx.openView(VIEWS.REGISTER)}
              disabled={isSending}
            >
              Zarejestruj się
            </button>
          </p>
        </form>
      </div>
    </View>
  );
};

export default LoginView;
