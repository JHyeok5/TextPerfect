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

// 사용량 제한 설정
const USAGE_LIMITS = {
  FREE: {
    dailyCharacters: 1000,
    maxTextLength: 3000,
  },
  PREMIUM: {
    dailyCharacters: 10000,
    maxTextLength: 10000,
  }
};

// 설정 기본값
const defaultSettings = {
  theme: 'light',
  language: 'ko',
  notifications: true,
};

// 오늘 날짜 키 생성
const getTodayKey = () => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식
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
  // 사용량 관리
  dailyUsage: 0,
  canUseCharacters: () => false,
  addUsage: () => {},
  getRemainingCharacters: () => 0,
  getUsagePercentage: () => 0,
  resetDailyUsage: () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(initialUser);
  const [subscription, setSubscription] = useState(defaultSubscription);
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [dailyUsage, setDailyUsage] = useState(0);

  // 로컬 스토리지에서 오늘의 사용량 로드
  useEffect(() => {
    const todayKey = getTodayKey();
    const usageKey = `textperfect_usage_${todayKey}`;
    const savedUsage = localStorage.getItem(usageKey);
    
    if (savedUsage) {
      setDailyUsage(parseInt(savedUsage, 10) || 0);
    }
    
    // 이전 날짜의 사용량 데이터 정리
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `textperfect_usage_${yesterday.toISOString().split('T')[0]}`;
    localStorage.removeItem(yesterdayKey);
  }, []);

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

  // 사용량 관리 함수들
  const getUserPlan = () => {
    if (!user) return 'FREE';
    return user.subscription?.plan || 'FREE';
  };

  const canUseCharacters = (characterCount) => {
    const plan = getUserPlan();
    const limit = USAGE_LIMITS[plan]?.dailyCharacters || USAGE_LIMITS.FREE.dailyCharacters;
    return (dailyUsage + characterCount) <= limit;
  };

  const addUsage = (characterCount) => {
    const newUsage = dailyUsage + characterCount;
    setDailyUsage(newUsage);
    
    // 로컬 스토리지에 저장
    const todayKey = getTodayKey();
    const usageKey = `textperfect_usage_${todayKey}`;
    localStorage.setItem(usageKey, newUsage.toString());
    
    logDebug('Usage updated:', { previous: dailyUsage, added: characterCount, new: newUsage });
  };

  const getRemainingCharacters = () => {
    const plan = getUserPlan();
    const limit = USAGE_LIMITS[plan]?.dailyCharacters || USAGE_LIMITS.FREE.dailyCharacters;
    return Math.max(0, limit - dailyUsage);
  };

  const getUsagePercentage = () => {
    const plan = getUserPlan();
    const limit = USAGE_LIMITS[plan]?.dailyCharacters || USAGE_LIMITS.FREE.dailyCharacters;
    return Math.min(100, (dailyUsage / limit) * 100);
  };

  const resetDailyUsage = () => {
    setDailyUsage(0);
    const todayKey = getTodayKey();
    const usageKey = `textperfect_usage_${todayKey}`;
    localStorage.removeItem(usageKey);
  };

  const getMaxTextLength = () => {
    const plan = getUserPlan();
    return USAGE_LIMITS[plan]?.maxTextLength || USAGE_LIMITS.FREE.maxTextLength;
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
    // 사용량 관리
    dailyUsage,
    canUseCharacters,
    addUsage,
    getRemainingCharacters,
    getUsagePercentage,
    resetDailyUsage,
    getMaxTextLength,
    getUserPlan,
    USAGE_LIMITS,
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