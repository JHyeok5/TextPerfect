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

  // TODO: 앱 시작 시 토큰 등으로 로그인 상태 복원 로직 추가
  useEffect(() => {
    // 예시: localStorage에서 토큰을 확인하고 유효하다면 사용자 정보 가져오기
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   // fetchUserProfile().then(userData => setUser(userData));
    // }
    setLoading(false); // 로딩 완료
  }, []);

  const login = (userData) => {
    setUser(userData);
    // TODO: localStorage.setItem('authToken', userData.token);
  };

  const logout = () => {
    setUser(null);
    // TODO: localStorage.removeItem('authToken');
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