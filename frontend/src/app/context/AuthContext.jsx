import {
  createContext,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';

import {
  loginUser,
  registerUser,
  fetchCurrentUser,
} from '../../shared/api/authApi.js';

import ToastContext from './ToastContext.jsx';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage.js';
import { STORAGE_KEYS } from '../../shared/const/index.js';

const AuthContext = createContext({
  user: null,
  token: null,
  isLogged: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const toastCtx = useContext(ToastContext);

  const [token, setToken, removeToken] = useLocalStorage(
    STORAGE_KEYS.AUTH_TOKEN,
    null,
    { json: false },
  );
  const [user, setUser, removeUser] = useLocalStorage(STORAGE_KEYS.USER, null);

  const isLogged = !!token;

  const logout = useCallback(() => {
    removeToken();
    removeUser();
  }, [removeToken, removeUser]);

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    fetchCurrentUser()
      .then((res) => {
        if (!res?.user) {
          throw new Error('Brak użytkownika w systemie.');
        }
        setUser(res.user);
      })
      .catch((err) => {
        console.warn('Fetch current user failed:', err);
        toastCtx.showToast('error', err.message || 'Sesja wygasła.');
        logout();
      });
  }, [token, toastCtx, logout, setUser]);

  const login = useCallback(
    async (email, password) => {
      try {
        const res = await loginUser({ email, password });

        if (!res?.user || !res?.token) {
          throw new Error('Nieprawidłowa odpowiedź serwera.');
        }

        setToken(res.token);
        setUser(res.user);

        toastCtx.showToast(
          'success',
          `Witaj ponownie, ${res.user.name || 'Użytkowniku'}.`,
        );

        return res.user;
      } catch (err) {
        toastCtx.showToast('error', err.message || 'Błąd logowania.');
        throw err;
      }
    },
    [toastCtx, setToken, setUser],
  );

  const register = useCallback(
    async (name, email, password) => {
      try {
        const res = await registerUser({ name, email, password });

        if (!res?.user || !res?.token) {
          throw new Error('Nieprawidłowa odpowiedź serwera.');
        }

        setToken(res.token);
        setUser(res.user);

        toastCtx.showToast(
          'success',
          `Witaj, ${res.user.name || 'Użytkowniku'}.`,
        );

        return res.user;
      } catch (err) {
        toastCtx.showToast('error', err.message || 'Błąd rejestracji.');
        throw err;
      }
    },
    [toastCtx, setToken, setUser],
  );

  const authCtxValue = useMemo(
    () => ({ user, token, isLogged, login, register, logout }),
    [user, token, isLogged, login, register, logout],
  );

  return (
    <AuthContext.Provider value={authCtxValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
