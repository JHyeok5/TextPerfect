import React, { createContext, useContext, useState } from 'react';

const AnalyticsContext = createContext(null);

export function AnalyticsProvider({ children }) {
  const [analyticsData, setAnalyticsData] = useState({});

  const logEvent = (eventName, eventProperties) => {
    // In a real application, you would send this to your analytics service
    console.log(`[Analytics] Event: ${eventName}`, eventProperties);
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
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
} 