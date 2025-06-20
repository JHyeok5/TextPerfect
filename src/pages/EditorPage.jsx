import React, { useState } from 'react';
import { toast } from 'react-toastify';

import TextEditor from '../components/editor/TextEditor';
import Button from '../components/common/Button';
import AnalysisIndicators from '../components/editor/AnalysisIndicators';
import EditorSidebar from './EditorPage/EditorSidebar';
import { apiRequest } from '../utils/api';
import { API_ENDPOINTS } from '../constants';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function EditorPage() {
  const [text, setText] = useState('');
  const [purpose, setPurpose] = useState('general');
  
  // 기본값을 명시적으로 설정하여 undefined 방지
  const [options, setOptions] = useState({
    formality: 50,
    conciseness: 50,
    terminology: 'basic',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  // 안전한 options 변경 함수
  const handleOptionsChange = (newOptions) => {
    if (newOptions && typeof newOptions === 'object') {
      setOptions(prevOptions => ({
        ...prevOptions,
        ...newOptions
      }));
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
      setText(result.optimized_text); // 에디터 내용을 최적화된 텍스트로 교체
      toast.success('텍스트 최적화가 완료되었습니다!');
    } catch (e) {
      setError(e.message);
      toast.error(e.message || '텍스트 최적화 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        {/* 사이드바 영역 */}
        <div className="lg:col-span-1">
          <EditorSidebar
            purpose={purpose}
            onPurposeChange={setPurpose}
            options={options}
            onOptionsChange={handleOptionsChange}
          />
        </div>

        {/* 에디터 및 분석 결과 영역 */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex-grow">
            <TextEditor value={text} onChange={setText} />
          </div>
          <AnalysisIndicators result={analysisResult} />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="flex justify-end">
            <Button onClick={handleOptimize} variant="primary" disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : '텍스트 최적화'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
} 