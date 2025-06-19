import React, { createContext, useContext, useState } from 'react';

// User 정보 기본값
const defaultUser = {
  nickname: '',
  level: 1,
  exp: 0,
  joinedAt: '',
};

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
  user: defaultUser,
  setUser: () => {},
  subscription: defaultSubscription,
  setSubscription: () => {},
  settings: defaultSettings,
  setSettings: () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState(defaultUser);
  const [subscription, setSubscription] = useState(defaultSubscription);
  const [settings, setSettings] = useState(defaultSettings);

  return (
    <UserContext.Provider value={{ user, setUser, subscription, setSubscription, settings, setSettings }}>
      {children}
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