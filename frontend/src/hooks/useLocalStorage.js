// ============================================================
// hooks/useLocalStorage.js — localStorage with React state sync
// Usage: const [value, setValue, removeValue] = useLocalStorage('key', defaultVal);
// ============================================================

import { useState } from 'react';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(`useLocalStorage set error for key "${key}":`, err);
    }
  };

  const removeValue = () => {
    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (err) {
      console.error(`useLocalStorage remove error for key "${key}":`, err);
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useLocalStorage;
