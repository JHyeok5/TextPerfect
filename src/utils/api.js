import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import handleError from './errorHandler';
import { API_ENDPOINTS } from '../constants';

// 환경별 기본 URL 설정
const getBaseUrl = () => {
  // 프로덕션 환경 (배포된 사이트)
  if (process.env.NODE_ENV === 'production') {
    return window.location.origin;
  }
  
  // 개발 환경
  return 'http://localhost:3000';
};

// 환경별 로깅 함수
const logDebug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

const logError = (...args) => {
  console.error(...args);
};

// 기본 API 요청 함수
export async function apiRequest(endpoint, options = {}) {
  // 절대 경로인 경우 그대로 사용, 아니면 기본 URL과 결합
  let url;
  if (endpoint.startsWith('http') || endpoint.startsWith('/.netlify/functions/')) {
    url = endpoint.startsWith('http') ? endpoint : `${getBaseUrl()}${endpoint}`;
  } else {
    url = API_ENDPOINTS[endpoint] || endpoint;
  }
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  logDebug('API Request:', { endpoint, url, baseUrl: getBaseUrl(), options });

  // 타임아웃 처리를 위한 AbortController 설정
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60초

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    logDebug('API Response status:', response.status);

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      logError('JSON parsing error:', parseError);
      throw new Error('서버 응답을 처리할 수 없습니다.');
    }
    
    if (!response.ok) {
      logError('API Error:', { status: response.status, data });
      
      // 상태 코드별 오류 메시지
      let errorMessage;
      if (response.status === 400) {
        errorMessage = data.error || data.message || '잘못된 요청입니다.';
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
        errorMessage = data.error || data.message || '알 수 없는 오류가 발생했습니다.';
      }
      
      const error = new Error(errorMessage);
      error.status = response.status;
      error.code = data.code;
      throw error;
    }

    logDebug('API Success:', data);
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    logError('API Request failed:', error);
    
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

// 인증 관련 API 함수들

/**
 * 회원가입 API 호출
 */
export async function signupUser(userData) {
  return await apiRequest('/.netlify/functions/auth/signup', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
}

/**
 * 로그인 API 호출
 */
export async function loginUser(credentials) {
  return await apiRequest('/.netlify/functions/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
}

/**
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  return await apiRequest('/.netlify/functions/auth/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
}

/**
 * 로그아웃 API 호출
 */
export async function logoutUser() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return { success: true, message: '이미 로그아웃된 상태입니다.' };
  }

  try {
    const result = await apiRequest('/.netlify/functions/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // 로컬 스토리지에서 토큰 제거
    localStorage.removeItem('authToken');
    
    return result;
  } catch (error) {
    // 로그아웃 실패해도 로컬 토큰은 제거
    localStorage.removeItem('authToken');
    throw error;
  }
}

/**
 * 토큰 유효성 검증 및 자동 로그인
 */
export async function validateAndRefreshAuth() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return null;
  }

  try {
    const result = await getCurrentUser();
    return result.data.user;
  } catch (error) {
    // 토큰이 무효하면 제거
    localStorage.removeItem('authToken');
    return null;
  }
} 