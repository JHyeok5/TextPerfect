import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import handleError from './errorHandler';
import { API_ENDPOINTS } from '../constants';

// 기본 API 요청 함수
export async function apiRequest(endpoint, options = {}) {
  const url = API_ENDPOINTS[endpoint] || endpoint;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      const error = new Error(data.message || '서버 오류가 발생했습니다.');
      error.code = data.code;
      throw error;
    }

    return data;
  } catch (error) {
    handleError(error);
    throw error;
  }
}

// API 요청 훅
export function useApiRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest(endpoint, options);
      setData(result.data);
      if (result.message) toast.success(result.message);
      return result.data;
    } catch (e) {
      setError(e);
      toast.error(e.message || '네트워크 오류');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, request };
} 