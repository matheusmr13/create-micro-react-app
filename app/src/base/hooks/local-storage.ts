import { useState } from 'react';
function useLocalStorage(key: string, initialValue?: string): [string | undefined, Function, Function] {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = JSON.parse(window.localStorage.getItem(key) || '');
      return item ? item : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: string) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  const clearValue = () => {
    setStoredValue(undefined);
    window.localStorage.removeItem(key);
  };

  return [storedValue, setValue, clearValue];
}

export default useLocalStorage;
