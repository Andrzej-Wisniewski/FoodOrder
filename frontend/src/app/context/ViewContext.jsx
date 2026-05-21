import { createContext, useState, useCallback, useMemo } from 'react';

const ViewContext = createContext({
  currentScreen: null,
  intent: null,
  showSuccessModal: false,
  openView: () => {},
  closeView: () => {},
  openWithIntent: () => {},
  resolveIntent: () => {},
  openSuccessModal: () => {},
  closeSuccessModal: () => {},
});

export const ViewContextProvider = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState(null);
  const [intent, setIntent] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const openView = useCallback(
    (screenName) => setCurrentScreen(screenName),
    [],
  );
  const closeView = useCallback(() => setCurrentScreen(null), []);

  const openWithIntent = useCallback((screen, intentScreen) => {
    setIntent(intentScreen);
    setCurrentScreen(screen);
  }, []);

  const resolveIntent = useCallback(() => {
    if (intent) {
      setCurrentScreen(intent);
      setIntent(null);
    } else {
      setCurrentScreen(null);
    }
  }, [intent]);

  const openSuccessModal = useCallback(() => setShowSuccessModal(true), []);
  const closeSuccessModal = useCallback(() => setShowSuccessModal(false), []);

  const viewCtxValue = useMemo(
    () => ({
      currentScreen,
      intent,
      openView,
      closeView,
      openWithIntent,
      resolveIntent,
      showSuccessModal,
      openSuccessModal,
      closeSuccessModal,
    }),
    [
      currentScreen,
      intent,
      openView,
      closeView,
      openWithIntent,
      resolveIntent,
      showSuccessModal,
      openSuccessModal,
      closeSuccessModal,
    ],
  );

  return (
    <ViewContext.Provider value={viewCtxValue}>{children}</ViewContext.Provider>
  );
};

export default ViewContext;
