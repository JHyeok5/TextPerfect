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

  console.log('API Request:', { endpoint, url, options });

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // 타임아웃 설정 (AbortController 사용)
      signal: AbortSignal.timeout(60000), // 60초
    });

    console.log('API Response status:', response.status);

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      throw new Error('서버 응답을 처리할 수 없습니다.');
    }
    
    if (!response.ok) {
      console.error('API Error:', { status: response.status, data });
      
      // 상태 코드별 오류 메시지
      let errorMessage;
      if (response.status === 400) {
        errorMessage = data.error || '잘못된 요청입니다.';
      } else if (response.status === 401) {
        errorMessage = '인증이 필요합니다.';
      } else if (response.status === 403) {
        errorMessage = '접근 권한이 없습니다.';
      } else if (response.status === 404) {
        errorMessage = '요청한 리소스를 찾을 수 없습니다.';
      } else if (response.status === 429) {
        errorMessage = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
      } else if (response.status >= 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      } else {
        errorMessage = data.error || '알 수 없는 오류가 발생했습니다.';
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.code = data.code;
      throw error;
    }

    console.log('API Success:', data);
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    
    // 네트워크 오류 처리
    if (error.name === 'AbortError') {
      error.message = '요청 시간이 초과되었습니다. 다시 시도해주세요.';
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      error.message = '네트워크 연결을 확인해주세요.';
    }
    
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
      setData(result);
      if (result.message) toast.success(result.message);
      return result;
    } catch (e) {
      setError(e);
      // toast는 handleError에서 이미 처리되므로 중복 방지
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, request };
} 