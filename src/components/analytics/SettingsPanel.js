import React from 'react';
import PropTypes from 'prop-types';

const AnalyticsSettingsPanel = ({ 
  showComparison = true, 
  showChart = true, 
  chartType = 'progress',
  onSettingsChange 
}) => {
  const handleToggle = (setting, value) => {
    if (onSettingsChange) {
      onSettingsChange({ [setting]: value });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">분석 표시 설정</h3>
      
      <div className="space-y-4">
        {/* 비교 뷰 표시 */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            텍스트 비교 표시
          </label>
          <button
            onClick={() => handleToggle('showComparison', !showComparison)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              showComparison ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                showComparison ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 차트 표시 */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            분석 차트 표시
          </label>
          <button
            onClick={() => handleToggle('showChart', !showChart)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              showChart ? 'bg-blue-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                showChart ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 차트 타입 선택 */}
        {showChart && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              차트 스타일
            </label>
            <select
              value={chartType}
              onChange={(e) => handleToggle('chartType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="progress">진행률 바</option>
              <option value="radar">레이더 차트</option>
              <option value="bar">막대 차트</option>
            </select>
          </div>
        )}

        {/* 분석 카테고리 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            분석 항목
          </label>
          <div className="space-y-2">
            {['가독성', '명확성', '전문성', '간결성'].map((category) => (
              <label key={category} className="flex items-center">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 초기화 버튼 */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => handleToggle('reset', true)}
          className="w-full px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          설정 초기화
        </button>
      </div>
    </div>
  );
};

AnalyticsSettingsPanel.propTypes = {
  showComparison: PropTypes.bool,
  showChart: PropTypes.bool,
  chartType: PropTypes.oneOf(['progress', 'radar', 'bar']),
  onSettingsChange: PropTypes.func,
};

export default AnalyticsSettingsPanel; 