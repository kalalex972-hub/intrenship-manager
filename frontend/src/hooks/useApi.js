// ============================================================
// hooks/useApi.js — Generic Data Fetching Hook
// Wraps any async service call with loading/error/data state.
// Usage:
//   const { data, loading, error, execute } = useApi(myService.getAll);
//   useEffect(() => { execute(); }, []);
// ============================================================

import { useState, useCallback, useRef } from 'react';
import { getErrorMessage } from '../utils/helpers';

const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Track if the component is still mounted to prevent state updates after unmount
  const isMounted = useRef(true);

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunc(...args);
        if (isMounted.current) {
          setData(result);
          setLoading(false);
        }
        return { success: true, data: result };
      } catch (err) {
        const message = getErrorMessage(err);
        if (isMounted.current) {
          setError(message);
          setLoading(false);
        }
        return { success: false, error: message };
      }
    },
    [apiFunc]
  );

  // Reset state
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

export default useApi;
