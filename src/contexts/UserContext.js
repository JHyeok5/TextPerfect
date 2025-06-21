import React, { createContext, useContext, useState, useEffect } from 'react';

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
      console.log('UserContext: Initializing auth...');
      const token = localStorage.getItem('authToken');
      console.log('UserContext: Found token:', !!token);
      
      if (token) {
        try {
          // validateAndRefreshAuth를 동적으로 import (순환 참조 방지)
          const { validateAndRefreshAuth } = await import('../utils/api');
          console.log('UserContext: Validating token...');
          const userData = await validateAndRefreshAuth();
          if (userData) {
            console.log('UserContext: Auto login successful:', userData);
            setUser(userData);
          } else {
            console.log('UserContext: Token validation failed');
          }
        } catch (error) {
          console.error('UserContext: Auto login failed:', error);
          // 토큰이 무효하면 제거
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
      console.log('UserContext: Auth initialization complete');
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    console.log('UserContext login called with:', userData);
    setUser(userData);
    // 토큰은 API 호출 시 이미 저장됨
  };

  const logout = async () => {
    try {
      // logoutUser를 동적으로 import (순환 참조 방지)
      const { logoutUser } = await import('../utils/api');
      await logoutUser();
    } catch (error) {
      console.error('Logout API failed:', error);
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