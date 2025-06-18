import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import handleError from './errorHandler';

export function useApiRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url, options);
      const json = await res.json();
      if (!json.success) {
        handleError(json.error);
        setError(json.error);
        toast.error(json.message || 'API 오류');
        setLoading(false);
        return null;
      }
      setData(json.data);
      if (json.message) toast.success(json.message);
      setLoading(false);
      return json.data;
    } catch (e) {
      handleError(e);
      setError(e);
      toast.error('네트워크 오류');
      setLoading(false);
      return null;
    }
  }, []);

  return { data, loading, error, request };
} 