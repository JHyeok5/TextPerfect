import React from 'react';
import PropTypes from 'prop-types';

const ScoreDisplay = ({ label, before, after }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const difference = after - before;
  const diffColor = difference > 0 ? 'text-green-500' : difference < 0 ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="text-center p-4 bg-gray-50 rounded-lg">
      <div className="text-sm text-gray-600 mb-2 font-semibold">{label}</div>
      <div className="flex items-center justify-center gap-2">
        <span className={`text-xl font-bold ${getScoreColor(before)}`}>{before}</span>
        <span className="text-lg">→</span>
        <span className={`text-xl font-bold ${getScoreColor(after)}`}>{after}</span>
      </div>
      <div className={`text-sm font-bold mt-1 ${diffColor}`}>
        {difference > 0 ? `+${difference}` : difference}
      </div>
    </div>
  );
};

ScoreDisplay.propTypes = {
  label: PropTypes.string.isRequired,
  before: PropTypes.number.isRequired,
  after: PropTypes.number.isRequired,
};

const AnalysisIndicators = ({ result }) => {
  if (!result) {
    return null;
  }

  const { before_analysis, after_analysis } = result;

  const indicators = [
    { label: '가독성', before: before_analysis.readability, after: after_analysis.readability },
    { label: '전문성', before: before_analysis.professionalLevel, after: after_analysis.professionalLevel },
    { label: '명확성', before: before_analysis.clarity, after: after_analysis.clarity },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4 text-center">AI 분석 결과</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {indicators.map(({ label, before, after }) => (
          <ScoreDisplay key={label} label={label} before={before} after={after} />
        ))}
      </div>
    </div>
  );
};

AnalysisIndicators.propTypes = {
  result: PropTypes.shape({
    before_analysis: PropTypes.object.isRequired,
    after_analysis: PropTypes.object.isRequired,
  }),
};

export default AnalysisIndicators; 