import React from 'react';
import PropTypes from 'prop-types';
import { useTextContext } from '../../contexts/TextContext';

const ComparisonView = ({ originalText, optimizedText }) => {
  const { text } = useTextContext();
  
  // props가 없으면 context에서 가져오기
  const original = originalText || text;
  const optimized = optimizedText || text; // 실제로는 최적화된 텍스트가 들어가야 함

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">텍스트 비교</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 원본 텍스트 */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            원본 텍스트
          </h3>
          <div className="bg-gray-50 border rounded-lg p-4 h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {original || '원본 텍스트가 없습니다.'}
            </pre>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {original ? `${original.length}자` : '0자'}
          </div>
        </div>

        {/* 최적화된 텍스트 */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            최적화된 텍스트
          </h3>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 h-64 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {optimized || '최적화된 텍스트가 없습니다.'}
            </pre>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            {optimized ? `${optimized.length}자` : '0자'}
          </div>
        </div>
      </div>

      {/* 변경 사항 요약 */}
      {original && optimized && original !== optimized && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">변경 사항</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-blue-600">글자 수 변화:</span>
              <span className="ml-1 font-medium">
                {original.length} → {optimized.length}
                ({optimized.length - original.length > 0 ? '+' : ''}{optimized.length - original.length})
              </span>
            </div>
            <div>
              <span className="text-blue-600">문장 수:</span>
              <span className="ml-1 font-medium">
                {original.split('.').length - 1} → {optimized.split('.').length - 1}
              </span>
            </div>
            <div>
              <span className="text-blue-600">단어 수:</span>
              <span className="ml-1 font-medium">
                {original.split(/\s+/).length} → {optimized.split(/\s+/).length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ComparisonView.propTypes = {
  originalText: PropTypes.string,
  optimizedText: PropTypes.string,
};

export default ComparisonView; 