import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ComparisonView from '../components/ComparisonView';
import AnalysisChart from '../components/AnalysisChart';
import { useTextContext } from '../context/TextContext';

const ResultsPage = () => {
  const { originalText, optimizedText } = useTextContext();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to editor if no optimized text exists
    if (!originalText || !optimizedText) {
      navigate('/editor');
    }
  }, [originalText, optimizedText, navigate]);
  
  if (!originalText || !optimizedText) {
    return null; // Will redirect, no need to render anything
  }
  
  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">최적화 결과</h1>
          <p className="text-gray-600 mt-2">
            원본 텍스트와 최적화된 텍스트를 비교하고 분석 결과를 확인하세요.
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <Link to="/editor" className="btn-outline mr-3">
            새 텍스트 최적화
          </Link>
        </div>
      </div>
      
      <div className="mb-8">
        <ComparisonView />
      </div>
      
      <div className="mb-8">
        <AnalysisChart />
      </div>
      
      <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">더 나은 텍스트를 위한 팁</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">학술 텍스트</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
              <li>명확한 논지와 구조를 갖추세요.</li>
              <li>주장을 뒷받침하는 근거와 인용을 포함하세요.</li>
              <li>전문 용어를 적절히 사용하되, 필요시 설명을 추가하세요.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">비즈니스 텍스트</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
              <li>핵심 메시지를 먼저 전달하세요.</li>
              <li>전문 용어와 업계 관련 언어를 적절히 사용하세요.</li>
              <li>명확한 행동 유도(Call to Action)를 포함하세요.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">기술 문서</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
              <li>명확하고 단계별로 설명하세요.</li>
              <li>필요한 경우 예시와 코드 샘플을 포함하세요.</li>
              <li>대상 독자의 기술 수준에 맞게 용어를 조정하세요.</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-700 mb-2">일반 텍스트</h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-5 list-disc">
              <li>간결하고 명확한 문장을 사용하세요.</li>
              <li>불필요한 수식어를 제거하세요.</li>
              <li>대상 독자를 고려하여 적절한 톤을 선택하세요.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 