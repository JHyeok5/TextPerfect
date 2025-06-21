import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { TextEditor, AnalysisIndicators } from '../components/editor';
import { Button, LoadingSpinner } from '../components/common';
import EditorSidebar from './EditorPage/EditorSidebar';
import { apiRequest } from '../utils/api';
import { API_ENDPOINTS } from '../constants';
import { useTextContext } from '../contexts/TextContext';
import { useUser } from '../contexts/UserContext';

export default function EditorPage() {
  // TextContext에서 상태 가져오기
  const { 
    text, 
    setText, 
    purpose, 
    setPurpose, 
    options, 
    setOptions 
  } = useTextContext();
  
  // UserContext에서 사용량 관리 기능 가져오기
  const { 
    isAuthenticated, 
    canUseCharacters, 
    addUsage, 
    getRemainingCharacters,
    getUsagePercentage,
    getMaxTextLength,
    getUserPlan,
    // 월 문서 수 관리
    canCreateDocument,
    addDocument,
    getRemainingDocs,
    monthlyDocs,
    USAGE_LIMITS
  } = useUser();
  
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

  // 최적화 실행 가능 여부 체크 (월 문서 수 제한 추가)
  const canOptimize = () => {
    // 기본 검증
    if (!text.trim()) return { canRun: false, reason: '분석할 텍스트를 입력해주세요.' };
    if (text.length < 10) return { canRun: false, reason: '더 긴 텍스트를 입력해주세요. (최소 10자)' };
    
    // 최대 길이 체크
    const maxLength = getMaxTextLength();
    if (text.length > maxLength) {
      return { canRun: false, reason: `텍스트가 너무 깁니다. (최대 ${maxLength.toLocaleString()}자)` };
    }
    
    // 비로그인 사용자는 제한된 기능만 사용 가능
    if (!isAuthenticated) {
      if (text.length > 500) {
        return { canRun: false, reason: '로그인하면 더 긴 텍스트를 최적화할 수 있습니다.' };
      }
      return { canRun: true, reason: '' };
    }
    
    // 로그인 사용자 - 월 문서 수 제한 체크
    if (!canCreateDocument()) {
      const remaining = getRemainingDocs();
      const userPlan = getUserPlan();
      return { 
        canRun: false, 
        reason: `이번 달 문서 한도를 초과했습니다. (${userPlan} 플랜: ${USAGE_LIMITS[userPlan]?.monthlyDocs || 0}개/월, 남은 문서: ${remaining}개)` 
      };
    }
    
    // 로그인 사용자 - 일일 사용량 체크
    if (!canUseCharacters(text.length)) {
      const remaining = getRemainingCharacters();
      return { 
        canRun: false, 
        reason: `일일 사용량이 부족합니다. (남은 사용량: ${remaining}자)` 
      };
    }
    
    return { canRun: true, reason: '' };
  };

  const handleOptimize = async () => {
    const { canRun, reason } = canOptimize();
    
    if (!canRun) {
      toast.error(reason);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      console.log('Starting optimization with:', { 
        textLength: text.length, 
        purpose: purpose || 'general', 
        options: options || {},
        isAuthenticated,
        remainingChars: getRemainingCharacters(),
        remainingDocs: getRemainingDocs(),
        userPlan: getUserPlan()
      });

      // Authorization 헤더 추가 (로그인 사용자인 경우)
      const headers = {};
      if (isAuthenticated) {
        const token = localStorage.getItem('authToken');
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const result = await apiRequest('OPTIMIZE', {
        method: 'POST',
        headers,
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
      
      // 사용량 추가 (로그인 사용자만)
      if (isAuthenticated) {
        addUsage(text.length);
        addDocument(); // 월 문서 수 증가
      }
      
      // 최적화된 텍스트로 업데이트
      if (result.optimized_text && result.optimized_text !== text) {
        handleTextChange(result.optimized_text);
        
        // 사용자 유형별 성공 메시지
        const userPlan = getUserPlan();
        let successMessage = '텍스트 최적화가 완료되었습니다!';
        
        if (userPlan === 'PREMIUM') {
          successMessage += ' 프리미엄 고급 분석이 적용되었습니다.';
        } else if (userPlan === 'FREE') {
          successMessage += ' 무료 플랜 기본 분석이 적용되었습니다.';
        }
        
        toast.success(successMessage);
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

  // 최적화 버튼 상태
  const optimizeCheck = canOptimize();
  const isOptimizeDisabled = isLoading || !optimizeCheck.canRun;

  // 사용자 유형별 UI 표시
  const getUserStatusInfo = () => {
    if (!isAuthenticated) {
      return {
        type: '비회원',
        color: 'gray',
        limits: '최대 500자, 기본 분석만 가능'
      };
    }
    
    const userPlan = getUserPlan();
    const remaining = getRemainingCharacters();
    const remainingDocs = getRemainingDocs();
    
    return {
      type: userPlan === 'FREE' ? '무료 플랜' : '프리미엄 플랜',
      color: userPlan === 'FREE' ? 'blue' : 'purple',
      limits: `일일 ${remaining.toLocaleString()}자 남음, 월 ${remainingDocs}개 문서 남음`
    };
  };

  const statusInfo = getUserStatusInfo();

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
          {/* 사용자 상태 표시 */}
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusInfo.color === 'purple' ? 'bg-purple-100 text-purple-700' :
            statusInfo.color === 'blue' ? 'bg-blue-100 text-blue-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {statusInfo.type}
          </div>
          
          {/* 모바일용 설정 토글 버튼 */}
          <button
            onClick={() => setShowMobileSettings(!showMobileSettings)}
            className="md:hidden px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <span>⚙️</span>
            <span>설정</span>
            <span className="text-gray-400">{showMobileSettings ? '▲' : '▼'}</span>
          </button>
          
          {/* 최적화 버튼 */}
          <Button 
            onClick={handleOptimize} 
            variant="primary" 
            disabled={isOptimizeDisabled}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg ${
              isOptimizeDisabled 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-xl'
            }`}
            title={!optimizeCheck.canRun ? optimizeCheck.reason : ''}
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
        {/* 사용자 상태 및 제한 안내 */}
        <div className={`p-4 rounded-lg border ${
          statusInfo.color === 'purple' ? 'bg-purple-50 border-purple-200' :
          statusInfo.color === 'blue' ? 'bg-blue-50 border-blue-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-medium">📊 현재 상태</span>
          </div>
          <p className="text-sm text-gray-700">{statusInfo.limits}</p>
          {!isAuthenticated && (
            <p className="text-xs text-gray-600 mt-1">
              💡 로그인하면 더 많은 기능과 높은 품질의 분석을 이용할 수 있습니다.
            </p>
          )}
        </div>

        {/* 모바일용 접이식 설정 패널 */}
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

        {/* 사용량 제한 안내 */}
        {!optimizeCheck.canRun && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <span className="text-orange-500">⚠️</span>
              <span className="text-orange-700 text-sm font-medium">제한 안내</span>
            </div>
            <p className="text-orange-600 text-sm mt-1">{optimizeCheck.reason}</p>
            {!isAuthenticated && (
              <p className="text-orange-600 text-xs mt-2">
                💡 로그인하면 더 많은 기능을 사용할 수 있습니다.
              </p>
            )}
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

        {/* 분석 결과 - 사용자 유형별 차별화 */}
        {analysisResult && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-500">✅</span>
              <span className="text-green-700 text-sm font-medium">
                최적화 완료 ({analysisResult.userType === 'PREMIUM' ? '프리미엄 고급 분석' : 
                           analysisResult.userType === 'FREE' ? '무료 플랜 기본 분석' : 
                           '비회원 기본 분석'})
              </span>
            </div>
            <AnalysisIndicators result={analysisResult} />
            
            {/* 프리미엄 전용 추가 정보 */}
            {analysisResult.userType === 'PREMIUM' && analysisResult.detailed_feedback && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <h4 className="text-sm font-medium text-purple-800 mb-2">🎯 상세 피드백 (프리미엄 전용)</h4>
                <p className="text-sm text-purple-700">{analysisResult.detailed_feedback}</p>
                
                {analysisResult.style_suggestions && analysisResult.style_suggestions.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-xs font-medium text-purple-800 mb-1">스타일 개선 제안:</h5>
                    <ul className="text-xs text-purple-600 space-y-1">
                      {analysisResult.style_suggestions.map((suggestion, index) => (
                        <li key={index}>• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 