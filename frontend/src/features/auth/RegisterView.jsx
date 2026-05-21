import { useCallback, useContext, useState } from 'react';

import AuthContext from '../../app/context/AuthContext.jsx';
import ViewContext from '../../app/context/ViewContext.jsx';
import ToastContext from '../../app/context/ToastContext.jsx';

import View from '../../ui/View.jsx';
import Input from '../../ui/Input.jsx';
import Button from '../../ui/Button.jsx';
import Loader from '../../ui/Loader.jsx';

import { calculatePasswordStrength } from '../../shared/utils/passwordStrength.js';
import { VIEWS } from '../../shared/const/index.js';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import styles from './RegisterView.module.css';

const RegisterView = () => {
  const authCtx = useContext(AuthContext);
  const viewCtx = useContext(ViewContext);
  const toastCtx = useContext(ToastContext);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const passwordStrength = calculatePasswordStrength(form.password);

  const close = useCallback(() => {
    setForm({ name: '', email: '', password: '', confirmPassword: '' });
    viewCtx.closeView();
  }, [viewCtx]);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const validate = () => {
    if (!form.name.trim()) return 'Imię jest wymagane.';
    if (!form.email.trim()) return 'E-mail jest wymagany.';
    if (form.password.length < 6) {
      return 'Hasło musi mieć minimum 6 znaków.';
    }
    if (form.password !== form.confirmPassword) {
      return 'Hasła nie są identyczne.';
    }
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      toastCtx.showToast('error', err);
      return;
    }

    setIsSending(true);

    try {
      await authCtx.register(form.name, form.email, form.password);
      viewCtx.resolveIntent();
    } catch {
      // powiadomienie pokazane z AuthContext
    } finally {
      setIsSending(false);
    }
  };

  return (
    <View openView onClose={close}>
      <h2 className={styles.title}>Rejestracja</h2>

      <div className={styles.formContainer}>
        <form onSubmit={submit} className={styles.form}>
          <Input
            label="Nazwa użytkownika"
            autoComplete="name"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            required
            disabled={isSending}
          />

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
              label="Hasło (min. 6 znaków)"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
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

          {form.password && (
            <div className={styles.strengthBar}>
              <div
                className={styles.strengthFill}
                style={{
                  width: `${(passwordStrength.score / 5) * 100}%`,
                  backgroundColor: passwordStrength.color,
                }}
              />
              <span
                className={styles.strengthLabel}
                style={{ color: passwordStrength.color }}
              >
                {passwordStrength.label}
              </span>
            </div>
          )}

          <div className={styles.passwordField}>
            <Input
              label="Powtórz hasło"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              required
              disabled={isSending}
            />
          </div>

          <div className={styles.actions}>
            <Button disabled={isSending} type="submit">
              {isSending ? <Loader size="sm" /> : 'Zarejestruj'}
            </Button>
            <Button textOnly type="button" onClick={close} disabled={isSending}>
              Anuluj
            </Button>
          </div>

          <p className={styles.switchAuth}>
            Masz już konto?{' '}
            <button
              type="button"
              className={styles.linkButton}
              onClick={() => viewCtx.openView(VIEWS.LOGIN)}
              disabled={isSending}
            >
              Zaloguj się
            </button>
          </p>
        </form>
      </div>
    </View>
  );
};

export default RegisterView;
