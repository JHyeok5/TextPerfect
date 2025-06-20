import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { TextEditor, AnalysisIndicators } from '../components/editor';
import { Button, LoadingSpinner } from '../components/common';
import EditorSidebar from './EditorPage/EditorSidebar';
import { apiRequest } from '../utils/api';
import { API_ENDPOINTS } from '../constants';
import { useTextContext } from '../contexts/TextContext';

export default function EditorPage() {
  // TextContext에서 상태 가져오기 (중복 제거)
  const { 
    text, 
    setText, 
    purpose, 
    setPurpose, 
    options, 
    setOptions 
  } = useTextContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  // 안전한 함수 래퍼
  const handlePurposeChange = (newPurpose) => {
    if (typeof setPurpose === 'function') {
      setPurpose(newPurpose);
    }
  };

  const handleOptionsChange = (newOptions) => {
    if (typeof setOptions === 'function') {
      setOptions(newOptions);
    }
  };

  const handleTextChange = (newText) => {
    if (typeof setText === 'function') {
      setText(newText);
    }
  };

  const handleOptimize = async () => {
    if (!text.trim()) {
      toast.error('분석할 텍스트를 입력해주세요.');
      return;
    }

    if (text.length < 10) {
      toast.error('더 긴 텍스트를 입력해주세요. (최소 10자)');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      console.log('Starting optimization with:', { 
        textLength: text.length, 
        purpose: purpose || 'general', 
        options: options || {} 
      });

      const result = await apiRequest('OPTIMIZE', {
        method: 'POST',
        body: JSON.stringify({ 
          text, 
          purpose: purpose || 'general', 
          options: options || { formality: 50, conciseness: 50, terminology: 'basic' }
        }),
      });
      
      console.log('Optimization result:', result);

      // 결과 검증
      if (!result || !result.optimized_text) {
        throw new Error('최적화 결과를 받을 수 없습니다.');
      }

      setAnalysisResult(result);
      
      // 최적화된 텍스트로 업데이트
      if (result.optimized_text && result.optimized_text !== text) {
        handleTextChange(result.optimized_text);
        toast.success('텍스트 최적화가 완료되었습니다!');
      } else {
        toast.info('텍스트가 이미 최적화되어 있습니다.');
      }
    } catch (e) {
      console.error('Optimization error:', e);
      const errorMessage = e.message || '텍스트 최적화 중 오류가 발생했습니다.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-lg">✍️</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">텍스트 에디터</h1>
            <p className="text-sm text-gray-600 hidden md:block">왼쪽 설정을 조정하고 텍스트를 입력하세요</p>
            <p className="text-sm text-gray-600 md:hidden">텍스트를 입력하고 아래 설정을 조정하세요</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* 모바일용 설정 토글 버튼 - md 미만에서만 표시 */}
          <button
            onClick={() => setShowMobileSettings(!showMobileSettings)}
            className="md:hidden px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span>⚙️</span>
            <span>설정</span>
            <span className="text-gray-400">{showMobileSettings ? '▲' : '▼'}</span>
          </button>
          <Button 
            onClick={handleOptimize} 
            variant="primary" 
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner />
                <span>최적화 중...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>🚀</span>
                <span>최적화 실행</span>
              </div>
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* 모바일용 접이식 설정 패널 - md 미만에서만 표시 */}
        {showMobileSettings && (
          <div className="md:hidden border-b pb-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <EditorSidebar
                purpose={purpose || 'general'}
                onPurposeChange={handlePurposeChange}
                options={options || { formality: 50, conciseness: 50, terminology: 'basic' }}
                onOptionsChange={handleOptionsChange}
              />
            </div>
          </div>
        )}

        {/* 텍스트 에디터 */}
        <div className="min-h-96">
          <TextEditor 
            value={text || ''} 
            onChange={handleTextChange} 
          />
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-red-500">❌</span>
              <span className="text-red-700 text-sm font-medium">오류 발생</span>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* 분석 결과 */}
        {analysisResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-500">✅</span>
              <span className="text-green-700 text-sm font-medium">최적화 완료</span>
            </div>
            <AnalysisIndicators result={analysisResult} />
          </div>
        )}
      </div>
    </div>
  );
} 