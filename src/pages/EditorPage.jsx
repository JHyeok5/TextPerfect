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

  // 디버깅을 위한 useEffect
  useEffect(() => {
    console.log('EditorPage - Context values:', {
      text: typeof text,
      setText: typeof setText,
      purpose: typeof purpose,
      setPurpose: typeof setPurpose,
      options: typeof options,
      setOptions: typeof setOptions
    });
  }, [text, setText, purpose, setPurpose, options, setOptions]);

  // 안전한 함수 래퍼
  const handlePurposeChange = (newPurpose) => {
    console.log('handlePurposeChange called with:', newPurpose);
    if (typeof setPurpose === 'function') {
      setPurpose(newPurpose);
    } else {
      console.error('setPurpose is not a function:', setPurpose);
    }
  };

  const handleOptionsChange = (newOptions) => {
    console.log('handleOptionsChange called with:', newOptions);
    if (typeof setOptions === 'function') {
      setOptions(newOptions);
    } else {
      console.error('setOptions is not a function:', setOptions);
    }
  };

  const handleTextChange = (newText) => {
    console.log('handleTextChange called with length:', newText.length);
    if (typeof setText === 'function') {
      setText(newText);
    } else {
      console.error('setText is not a function:', setText);
    }
  };

  const handleOptimize = async () => {
    if (!text.trim()) {
      toast.error('분석할 텍스트를 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await apiRequest(API_ENDPOINTS.OPTIMIZE, {
        method: 'POST',
        body: JSON.stringify({ text, purpose, options }),
      });
      
      setAnalysisResult(result);
      handleTextChange(result.optimized_text); // 안전한 함수 사용
      toast.success('텍스트 최적화가 완료되었습니다!');
    } catch (e) {
      setError(e.message);
      toast.error(e.message || '텍스트 최적화 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* 개선된 사이드바 영역 */}
          <div className="xl:col-span-1">
            <div className="sticky top-4">
              <EditorSidebar
                purpose={purpose || 'general'}
                onPurposeChange={handlePurposeChange}
                options={options || { formality: 50, conciseness: 50, terminology: 'basic' }}
                onOptionsChange={handleOptionsChange}
              />
            </div>
          </div>

          {/* 에디터 및 분석 결과 영역 */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-lg">✍️</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">텍스트 에디터</h1>
                    <p className="text-sm text-gray-600">최적화할 텍스트를 입력하고 설정을 조정하세요</p>
                  </div>
                </div>
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
                      <span>텍스트 최적화</span>
                    </div>
                  )}
                </Button>
              </div>

              <div className="space-y-6">
                {/* 텍스트 에디터 */}
                <div className="h-96">
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
          </div>

        </div>
      </div>
    </div>
  );
} 