import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

const AnalysisIndicators = ({ text }) => {
  const analysis = useMemo(() => {
    if (!text.trim()) {
      return {
        readability: 0,
        professionalLevel: 0,
        clarity: 0
      };
    }

    // TODO: 실제 분석 로직 구현
    // 현재는 임시로 랜덤 값을 반환
    return {
      readability: Math.floor(Math.random() * 100),
      professionalLevel: Math.floor(Math.random() * 100),
      clarity: Math.floor(Math.random() * 100)
    };
  }, [text]);

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const indicators = [
    { label: '가독성', value: analysis.readability },
    { label: '전문성', value: analysis.professionalLevel },
    { label: '명확성', value: analysis.clarity }
  ];

  if (!text.trim()) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">텍스트 분석</h2>
      <div className="grid grid-cols-3 gap-4">
        {indicators.map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-sm text-gray-600 mb-1">{label}</div>
            <div className={`text-2xl font-bold ${getScoreColor(value)}`}>
              {value}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

AnalysisIndicators.propTypes = {
  text: PropTypes.string.isRequired
};

export default AnalysisIndicators; 