import { useContext, Suspense, lazy } from 'react';

import { CartContextProvider } from './context/CartContext.jsx';
import { ViewContextProvider } from './context/ViewContext.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { ToastContextProvider } from './context/ToastContext.jsx';

import ViewContext from './context/ViewContext.jsx';
import AuthContext from './context/AuthContext.jsx';

import Header from './Header.jsx';
import Footer from './Footer.jsx';
import MealsList from '../features/meals/MealsList.jsx';
import CartView from '../features/cart/CartView.jsx';

import Loader from '../ui/Loader.jsx';
import SuccessModal from '../ui/SuccessModal.jsx';

import { ROLES, VIEWS } from '../shared/const/index.js';

const LoginView = lazy(() => import('../features/auth/LoginView.jsx'));
const RegisterView = lazy(() => import('../features/auth/RegisterView.jsx'));
const OrdersView = lazy(() => import('../features/orders/OrdersView.jsx'));
const CheckoutView = lazy(() => import('../features/orders/CheckoutView.jsx'));
const MealAdminView = lazy(() => import('../features/admin/MealAdminView.jsx'));
const MealCreateView = lazy(
  () => import('../features/admin/MealCreateView.jsx'),
);
const Documentation = lazy(() => import('./documentation/Documentation.jsx'));

const AppContent = () => {
  const viewCtx = useContext(ViewContext);
  const authCtx = useContext(AuthContext);

  const screen = viewCtx.currentScreen;
  const isAdmin = authCtx.user?.role === ROLES.ADMIN;

  return (
    <>
      <Header />
      <MealsList hidden={screen !== null} />
      {screen === VIEWS.CART && <CartView />}
      <Suspense fallback={<Loader size="md" />}>
        {screen === VIEWS.LOGIN && <LoginView />}
        {screen === VIEWS.REGISTER && <RegisterView />}
        {screen === VIEWS.MEAL_CREATE && isAdmin && <MealCreateView />}
        {screen === VIEWS.MEALS_ADMIN && isAdmin && <MealAdminView />}
        {screen === VIEWS.CHECKOUT && (
          <CheckoutView key={authCtx.user?.id ?? 'guest'} />
        )}
        {screen === VIEWS.ORDERS && <OrdersView />}
        {screen === VIEWS.DOCUMENTATION && <Documentation />}
      </Suspense>
      <SuccessModal />
      {isAdmin && <Footer />}
    </>
  );
};

export default function App() {
  return (
    <ToastContextProvider>
      <AuthContextProvider>
        <ViewContextProvider>
          <CartContextProvider>
            <AppContent />
          </CartContextProvider>
        </ViewContextProvider>
      </AuthContextProvider>
    </ToastContextProvider>
  );
}
