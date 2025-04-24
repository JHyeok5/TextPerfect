import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTextContext } from '../context/TextContext';
import SettingsPanel from './SettingsPanel';

const TextEditor = () => {
  const navigate = useNavigate();
  const { 
    originalText,
    setOriginalText,
    optimizeText,
    isLoading,
    error,
    optimizedText,
    usageInfo
  } = useTextContext();
  
  const [charCount, setCharCount] = useState(0);
  
  useEffect(() => {
    setCharCount(originalText.length);
  }, [originalText]);
  
  const handleTextChange = (e) => {
    setOriginalText(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!originalText.trim()) {
      alert('텍스트를 입력해주세요.');
      return;
    }
    
    await optimizeText();
    
    if (optimizedText) {
      navigate('/results');
    }
  };
  
  const isSubmitDisabled = isLoading || originalText.length === 0 || originalText.length > usageInfo.dailyRemaining;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="card h-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              텍스트 입력
            </h2>
            <div className="text-sm text-gray-500 flex items-center">
              <span 
                className={`mr-1 ${
                  charCount > usageInfo.dailyRemaining ? 'text-red-500 font-bold' : ''
                }`}
              >
                {charCount.toLocaleString()}
              </span>
              <span>/</span>
              <span className="ml-1">{usageInfo.dailyRemaining.toLocaleString()}</span>
              <span className="ml-1">자</span>
            </div>
          </div>
          
          <textarea
            className="form-input min-h-[300px] font-mono text-sm"
            placeholder="최적화할 텍스트를 입력하세요..."
            value={originalText}
            onChange={handleTextChange}
            disabled={isLoading}
          />
          
          {error && !error.includes('일일 사용량 한도') && (
            <div className="mt-2 text-sm text-red-600">
              {error}
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <button
              className="btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  텍스트 최적화 중...
                </div>
              ) : '텍스트 최적화'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <SettingsPanel />
      </div>
    </div>
  );
};

export default TextEditor; 