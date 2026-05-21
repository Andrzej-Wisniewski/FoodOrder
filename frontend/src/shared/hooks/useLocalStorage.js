import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue, options = {}) {
  const { json = true, syncTabs = true } = options;

  const readFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initialValue;
      return json ? JSON.parse(raw) : raw;
    } catch {
      return initialValue;
    }
  }, [key, initialValue, json]);

  const [value, setValue] = useState(readFromStorage);

  useEffect(() => {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
        return;
      }
      const toStore = json ? JSON.stringify(value) : String(value);
      localStorage.setItem(key, toStore);
    } catch (err) {
      console.warn('localStorage error:', err);
    }
  }, [key, value, json]);

  useEffect(() => {
    if (!syncTabs) return;

    const handleStorageChange = (event) => {
      if (event.key !== key) return;
      if (event.newValue === null) {
        setValue(initialValue);
        return;
      }
      try {
        const newValue = json ? JSON.parse(event.newValue) : event.newValue;
        setValue(newValue);
      } catch {
        setValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, initialValue, json, syncTabs]);

  const remove = useCallback(() => {
    setValue(null);
  }, []);

  return [value, setValue, remove];
}
