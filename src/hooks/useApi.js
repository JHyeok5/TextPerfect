import { useState, useCallback } from 'react';

export function useApi(apiFunc, options = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const callApi = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      let retries = options.retries || 0;
      let lastError = null;
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const result = await apiFunc(...args);
          setData(result);
          setLoading(false);
          return result;
        } catch (err) {
          lastError = err;
          setError(err);
          if (attempt === retries) {
            setLoading(false);
            throw err;
          }
        }
      }
      setLoading(false);
      throw lastError;
    },
    [apiFunc, options.retries]
  );

  return { data, loading, error, callApi };
} 