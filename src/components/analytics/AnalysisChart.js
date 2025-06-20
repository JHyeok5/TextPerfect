import React from 'react';
import PropTypes from 'prop-types';

const AnalysisChart = ({ data }) => {
  // 기본 분석 데이터
  const defaultData = {
    readability: { before: 65, after: 85 },
    clarity: { before: 70, after: 90 },
    professionalism: { before: 60, after: 80 },
    conciseness: { before: 55, after: 75 },
  };

  const analysisData = data || defaultData;

  const ProgressBar = ({ label, before, after, color = 'blue' }) => {
    const improvement = after - before;
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
    };

    return (
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <div className="text-sm text-gray-600">
            <span className="text-gray-500">{before}%</span>
            <span className="mx-2">→</span>
            <span className="font-semibold">{after}%</span>
            <span className={`ml-2 text-xs ${improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
              ({improvement > 0 ? '+' : ''}{improvement}%)
            </span>
          </div>
        </div>
        
        <div className="relative">
          {/* Before bar (background) */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gray-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${before}%` }}
            ></div>
          </div>
          
          {/* After bar (overlay) */}
          <div className="absolute top-0 w-full">
            <div 
              className={`${colorClasses[color]} h-3 rounded-full transition-all duration-1000 delay-300`}
              style={{ width: `${after}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-6">AI 분석 상세 결과</h2>
      
      <div className="space-y-6">
        <ProgressBar 
          label="가독성 (Readability)" 
          before={analysisData.readability.before} 
          after={analysisData.readability.after}
          color="blue"
        />
        
        <ProgressBar 
          label="명확성 (Clarity)" 
          before={analysisData.clarity.before} 
          after={analysisData.clarity.after}
          color="green"
        />
        
        <ProgressBar 
          label="전문성 (Professionalism)" 
          before={analysisData.professionalism.before} 
          after={analysisData.professionalism.after}
          color="purple"
        />
        
        <ProgressBar 
          label="간결성 (Conciseness)" 
          before={analysisData.conciseness.before} 
          after={analysisData.conciseness.after}
          color="orange"
        />
      </div>

      {/* 전체 점수 */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-sm text-gray-600 mb-1">전체 개선도</div>
          <div className="text-2xl font-bold text-green-600">
            +{Math.round(
              Object.values(analysisData).reduce((acc, curr) => 
                acc + (curr.after - curr.before), 0
              ) / Object.keys(analysisData).length
            )}%
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="mt-6 flex justify-center space-x-6 text-xs text-gray-500">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gray-400 rounded mr-2"></div>
          <span>최적화 전</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
          <span>최적화 후</span>
        </div>
      </div>
    </div>
  );
};

AnalysisChart.propTypes = {
  data: PropTypes.shape({
    readability: PropTypes.shape({
      before: PropTypes.number.isRequired,
      after: PropTypes.number.isRequired,
    }),
    clarity: PropTypes.shape({
      before: PropTypes.number.isRequired,
      after: PropTypes.number.isRequired,
    }),
    professionalism: PropTypes.shape({
      before: PropTypes.number.isRequired,
      after: PropTypes.number.isRequired,
    }),
    conciseness: PropTypes.shape({
      before: PropTypes.number.isRequired,
      after: PropTypes.number.isRequired,
    }),
  }),
};

export default AnalysisChart; 