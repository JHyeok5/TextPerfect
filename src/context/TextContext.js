import React, { createContext, useState, useContext, useEffect } from 'react';

// Initial state
const initialState = {
  originalText: '',
  optimizedText: '',
  purpose: 'general', // general, academic, business, technical
  options: {
    formality: 50,
    conciseness: 50,
    terminology: 'basic'
  },
  analysis: null,
  changes: [],
  usageInfo: {
    charactersProcessed: 0,
    dailyRemaining: 1000, // Free tier limit
  },
  isLoading: false,
  error: null
};

// Create the context
const TextContext = createContext();

// Custom hook to use the context
export const useTextContext = () => useContext(TextContext);

// Context provider component
export const TextContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  
  // Load state from localStorage on initial render
  useEffect(() => {
    const savedState = localStorage.getItem('textperfect:state');
    if (savedState) {
      setState(prev => ({
        ...prev,
        ...JSON.parse(savedState)
      }));
    }
    
    // Load usage info
    const usageInfo = localStorage.getItem('textperfect:usage');
    if (usageInfo) {
      const parsedUsage = JSON.parse(usageInfo);
      
      // Check if we need to reset daily usage (new day)
      const lastUsageDate = new Date(parsedUsage.lastUpdated);
      const currentDate = new Date();
      
      if (lastUsageDate.toDateString() !== currentDate.toDateString()) {
        // Reset daily limits for a new day
        const newUsageInfo = {
          charactersProcessed: 0,
          dailyRemaining: 1000,
          lastUpdated: currentDate.toISOString()
        };
        
        localStorage.setItem('textperfect:usage', JSON.stringify(newUsageInfo));
        setState(prev => ({
          ...prev,
          usageInfo: newUsageInfo
        }));
      } else {
        setState(prev => ({
          ...prev,
          usageInfo: parsedUsage
        }));
      }
    } else {
      // Initialize usage tracking
      const newUsageInfo = {
        charactersProcessed: 0,
        dailyRemaining: 1000,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('textperfect:usage', JSON.stringify(newUsageInfo));
    }
  }, []);
  
  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('textperfect:state', JSON.stringify({
      originalText: state.originalText,
      optimizedText: state.optimizedText,
      purpose: state.purpose,
      options: state.options,
    }));
  }, [state.originalText, state.optimizedText, state.purpose, state.options]);
  
  // Update original text
  const setOriginalText = (text) => {
    setState(prev => ({ ...prev, originalText: text }));
  };
  
  // Update purpose
  const setPurpose = (purpose) => {
    setState(prev => ({ ...prev, purpose }));
  };
  
  // Update options
  const setOptions = (options) => {
    setState(prev => ({
      ...prev,
      options: { ...prev.options, ...options }
    }));
  };
  
  // Reset state
  const resetState = () => {
    setState(initialState);
  };
  
  // Optimize text function
  const optimizeText = async () => {
    // Check if there's enough character limit left
    if (state.usageInfo.dailyRemaining < state.originalText.length) {
      setState(prev => ({
        ...prev,
        error: '일일 사용량 한도에 도달했습니다. 내일 다시 시도하거나 프리미엄으로 업그레이드하세요.'
      }));
      return;
    }
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/.netlify/functions/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: state.originalText,
          purpose: state.purpose,
          options: state.options
        }),
      });
      
      if (!response.ok) {
        throw new Error('텍스트 최적화 중 오류가 발생했습니다.');
      }
      
      const data = await response.json();
      
      // Update usage info
      const newUsageInfo = {
        charactersProcessed: state.usageInfo.charactersProcessed + state.originalText.length,
        dailyRemaining: state.usageInfo.dailyRemaining - state.originalText.length,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('textperfect:usage', JSON.stringify(newUsageInfo));
      
      setState(prev => ({
        ...prev,
        optimizedText: data.optimized,
        changes: data.changes,
        analysis: data.analysis,
        usageInfo: newUsageInfo,
        isLoading: false
      }));
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false
      }));
    }
  };
  
  const value = {
    ...state,
    setOriginalText,
    setPurpose,
    setOptions,
    optimizeText,
    resetState
  };
  
  return (
    <TextContext.Provider value={value}>
      {children}
    </TextContext.Provider>
  );
}; 