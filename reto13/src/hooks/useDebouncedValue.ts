import { useEffect, useState } from 'react';

/** Devuelve el valor solo después de que deja de cambiar durante `delay` ms. */
export function useDebouncedValue<T>(value: T, delay = 450): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
