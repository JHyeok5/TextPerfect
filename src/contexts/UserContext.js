import React, { createContext, useContext, useState, useEffect } from 'react';

// 환경별 로깅 함수
const logDebug = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

const logError = (...args) => {
  console.error(...args);
};

// User 정보 기본값 (비로그인 상태)
const initialUser = null;

// 구독 상태 기본값
const defaultSubscription = {
  plan: 'FREE',
  expiresAt: '',
  usage: {
    monthlyDocs: 0,
    maxTextLength: 0,
  },
};

// 설정 기본값
const defaultSettings = {
  theme: 'light',
  language: 'ko',
  notifications: true,
};

const UserContext = createContext({
  user: initialUser,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  subscription: defaultSubscription,
  setSubscription: () => {},
  settings: defaultSettings,
  setSettings: () => {},
  loading: true,
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(initialUser);
  const [subscription, setSubscription] = useState(defaultSubscription);
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true); // 앱 로딩 시 인증 상태 확인 중

  // 앱 시작 시 토큰으로 로그인 상태 복원
  useEffect(() => {
    const initializeAuth = async () => {
      logDebug('UserContext: Initializing auth...');
      const token = localStorage.getItem('authToken');
      logDebug('UserContext: Found token:', !!token);
      
      if (token) {
        try {
          // validateAndRefreshAuth를 동적으로 import (순환 참조 방지)
          const { validateAndRefreshAuth } = await import('../utils/api');
          logDebug('UserContext: Validating token...');
          const userData = await validateAndRefreshAuth();
          if (userData) {
            logDebug('UserContext: Auto login successful:', userData);
            setUser(userData);
          } else {
            logDebug('UserContext: Token validation failed');
          }
        } catch (error) {
          logError('UserContext: Auto login failed:', error);
          // 토큰이 무효하면 제거
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
      logDebug('UserContext: Auth initialization complete');
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    logDebug('UserContext login called with:', userData);
    setUser(userData);
    // 토큰은 API 호출 시 이미 저장됨
  };

  const logout = async () => {
    try {
      // logoutUser를 동적으로 import (순환 참조 방지)
      const { logoutUser } = await import('../utils/api');
      await logoutUser();
    } catch (error) {
      logError('Logout API failed:', error);
      // API 실패해도 로컬 상태는 정리
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    subscription,
    setSubscription,
    settings,
    setSettings,
    loading,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 