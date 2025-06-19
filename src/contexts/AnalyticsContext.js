import React, { createContext, useContext, useState } from 'react';

const AnalyticsContext = createContext(null);

export const AnalyticsProvider = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState({});

  const logEvent = (eventName, eventProperties) => {
    // 실제 분석 서비스(예: Google Analytics, Mixpanel)와 연동하는 로직을 여기에 추가합니다.
    // console.log(`[Analytics] Event: ${eventName}`, eventProperties);
    setAnalyticsData(prevData => ({
      ...prevData,
      [Date.now()]: { eventName, eventProperties }
    }));
  };

  const value = { analyticsData, logEvent };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
} 