import React from 'react';
import PropTypes from 'prop-types';

const PURPOSES = [
  { id: 'academic', label: '학술' },
  { id: 'business', label: '비즈니스' },
  { id: 'technical', label: '기술' },
  { id: 'general', label: '일반' }
];

const SettingsPanel = ({ purpose, options = {}, onPurposeChange, onOptionsChange }) => {
  const safeOptions = {
    formality: 50,
    conciseness: 50,
    terminology: 'basic',
    ...options
  };

  const handleFormalityChange = (e) => {
    onOptionsChange({
      ...safeOptions,
      formality: parseInt(e.target.value, 10)
    });
  };

  const handleConcisenessChange = (e) => {
    onOptionsChange({
      ...safeOptions,
      conciseness: parseInt(e.target.value, 10)
    });
  };

  const handleTerminologyChange = (e) => {
    onOptionsChange({
      ...safeOptions,
      terminology: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">텍스트 최적화 설정</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          목적
        </label>
        <div className="grid grid-cols-4 gap-2">
          {PURPOSES.map(({ id, label }) => (
            <button
              key={id}
              className={`py-2 px-4 rounded ${
                purpose === id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => onPurposeChange(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            격식도 ({safeOptions.formality}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={safeOptions.formality}
            onChange={handleFormalityChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            간결성 ({safeOptions.conciseness}%)
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={safeOptions.conciseness}
            onChange={handleConcisenessChange}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            전문용어 수준
          </label>
          <select
            value={safeOptions.terminology}
            onChange={handleTerminologyChange}
            className="w-full p-2 border rounded"
          >
            <option value="basic">기본</option>
            <option value="advanced">전문가</option>
          </select>
        </div>
      </div>
    </div>
  );
};

SettingsPanel.propTypes = {
  purpose: PropTypes.oneOf(['academic', 'business', 'technical', 'general']).isRequired,
  options: PropTypes.shape({
    formality: PropTypes.number,
    conciseness: PropTypes.number,
    terminology: PropTypes.oneOf(['basic', 'advanced'])
  }),
  onPurposeChange: PropTypes.func.isRequired,
  onOptionsChange: PropTypes.func.isRequired
};

export default SettingsPanel; 