import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const PURPOSES = [
  { 
    id: 'academic', 
    label: '학술', 
    icon: '🎓',
    desc: '논문, 연구보고서',
    color: 'blue'
  },
  { 
    id: 'business', 
    label: '비즈니스', 
    icon: '💼',
    desc: '제안서, 이메일',
    color: 'green'
  },
  { 
    id: 'technical', 
    label: '기술', 
    icon: '⚙️',
    desc: '매뉴얼, 문서',
    color: 'purple'
  },
  { 
    id: 'general', 
    label: '일반', 
    icon: '📝',
    desc: '블로그, 소개글',
    color: 'gray'
  }
];

const TERMINOLOGY_OPTIONS = [
  { value: 'basic', label: '기본', desc: '일반적인 용어 사용' },
  { value: 'advanced', label: '전문가', desc: '전문 용어 적극 활용' }
];

const SettingsPanel = ({ purpose, options = {}, onPurposeChange, onOptionsChange, debugId = 'unknown' }) => {
  // 디버깅을 위한 useEffect
  useEffect(() => {
    console.log(`🔍 SettingsPanel [${debugId}] rendered:`, {
      purpose,
      options,
      onPurposeChange: typeof onPurposeChange,
      onOptionsChange: typeof onOptionsChange
    });
  }, [purpose, options, onPurposeChange, onOptionsChange, debugId]);

  const safeOptions = {
    formality: 50,
    conciseness: 50,
    terminology: 'basic',
    ...options
  };

  const handleFormalityChange = (e) => {
    console.log(`🎛️ [${debugId}] handleFormalityChange triggered with value:`, e.target.value);
    const newOptions = {
      ...safeOptions,
      formality: parseInt(e.target.value, 10)
    };
    console.log(`📤 [${debugId}] Calling onOptionsChange with:`, newOptions);
    
    if (typeof onOptionsChange === 'function') {
      onOptionsChange(newOptions);
    } else {
      console.error(`❌ [${debugId}] onOptionsChange is not a function:`, onOptionsChange);
    }
  };

  const handleConcisenessChange = (e) => {
    console.log(`🎛️ [${debugId}] handleConcisenessChange triggered with value:`, e.target.value);
    const newOptions = {
      ...safeOptions,
      conciseness: parseInt(e.target.value, 10)
    };
    console.log(`📤 [${debugId}] Calling onOptionsChange with:`, newOptions);
    
    if (typeof onOptionsChange === 'function') {
      onOptionsChange(newOptions);
    } else {
      console.error(`❌ [${debugId}] onOptionsChange is not a function:`, onOptionsChange);
    }
  };

  const handleTerminologyChange = (value) => {
    console.log(`🎛️ [${debugId}] handleTerminologyChange triggered with value:`, value);
    const newOptions = {
      ...safeOptions,
      terminology: value
    };
    console.log(`📤 [${debugId}] Calling onOptionsChange with:`, newOptions);
    
    if (typeof onOptionsChange === 'function') {
      onOptionsChange(newOptions);
    } else {
      console.error(`❌ [${debugId}] onOptionsChange is not a function:`, onOptionsChange);
    }
  };

  const handlePurposeClick = (purposeId) => {
    console.log(`🎯 [${debugId}] handlePurposeClick triggered with:`, purposeId);
    
    if (typeof onPurposeChange === 'function') {
      onPurposeChange(purposeId);
    } else {
      console.error(`❌ [${debugId}] onPurposeChange is not a function:`, onPurposeChange);
    }
  };

  const getFormalityLabel = (value) => {
    if (value <= 20) return '매우 캐주얼';
    if (value <= 40) return '캐주얼';
    if (value <= 60) return '보통';
    if (value <= 80) return '격식';
    return '매우 격식';
  };

  const getConcisenessLabel = (value) => {
    if (value <= 20) return '매우 상세';
    if (value <= 40) return '상세';
    if (value <= 60) return '보통';
    if (value <= 80) return '간결';
    return '매우 간결';
  };

  const getColorClasses = (color, isSelected) => {
    const colors = {
      blue: isSelected 
        ? 'bg-blue-500 text-white border-blue-500' 
        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      green: isSelected 
        ? 'bg-green-500 text-white border-green-500' 
        : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100',
      purple: isSelected 
        ? 'bg-purple-500 text-white border-purple-500' 
        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      gray: isSelected 
        ? 'bg-gray-500 text-white border-gray-500' 
        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="space-y-6" data-debug={`settings-panel-${debugId}`}>

      {/* 목적 선택 카드 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <span className="text-blue-600 text-sm">🎯</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">텍스트 목적</h3>
        </div>
        
        <div className="grid grid-cols-1 gap-3">
          {PURPOSES.map(({ id, label, icon, desc, color }) => (
            <button
              key={id}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${getColorClasses(color, purpose === id)}`}
              onClick={() => handlePurposeClick(id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{icon}</span>
                <div className="flex-grow">
                  <div className="font-medium">{label}</div>
                  <div className={`text-xs mt-1 ${purpose === id ? 'text-white/80' : 'text-gray-500'}`}>
                    {desc}
                  </div>
                </div>
                {purpose === id && (
                  <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 세부 설정 카드 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <span className="text-purple-600 text-sm">⚙️</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">세부 설정</h3>
        </div>
        
        <div className="space-y-6">
          {/* 격식도 설정 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">격식도</label>
              <div className="bg-blue-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-blue-700">
                  {getFormalityLabel(safeOptions.formality)}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={safeOptions.formality}
              onChange={handleFormalityChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${safeOptions.formality}%, #e5e7eb ${safeOptions.formality}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>캐주얼</span>
              <span>격식적</span>
            </div>
          </div>

          {/* 간결성 설정 */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-gray-700">간결성</label>
              <div className="bg-green-50 px-3 py-1 rounded-full">
                <span className="text-sm font-medium text-green-700">
                  {getConcisenessLabel(safeOptions.conciseness)}
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={safeOptions.conciseness}
              onChange={handleConcisenessChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #10b981 ${safeOptions.conciseness}%, #e5e7eb ${safeOptions.conciseness}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>상세하게</span>
              <span>간결하게</span>
            </div>
          </div>

          {/* 전문용어 수준 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              전문용어 수준
            </label>
            <div className="grid grid-cols-2 gap-3">
              {TERMINOLOGY_OPTIONS.map(({ value, label, desc }) => (
                <button
                  key={value}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                    safeOptions.terminology === value
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100'
                  }`}
                  onClick={() => handleTerminologyChange(value)}
                >
                  <div className="font-medium text-sm">{label}</div>
                  <div className={`text-xs mt-1 ${
                    safeOptions.terminology === value ? 'text-white/80' : 'text-orange-600'
                  }`}>
                    {desc}
                  </div>
                  {safeOptions.terminology === value && (
                    <div className="mt-2">
                      <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center ml-auto">
                        <span className="text-xs text-orange-500">✓</span>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 요약 정보 카드 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">📊</span>
          <span className="text-sm font-medium text-gray-700">현재 설정 요약</span>
        </div>
        <div className="text-xs text-gray-600 space-y-1">
          <div>• 목적: <span className="font-medium">{PURPOSES.find(p => p.id === purpose)?.label}</span></div>
          <div>• 격식도: <span className="font-medium">{getFormalityLabel(safeOptions.formality)}</span></div>
          <div>• 간결성: <span className="font-medium">{getConcisenessLabel(safeOptions.conciseness)}</span></div>
          <div>• 전문용어: <span className="font-medium">{TERMINOLOGY_OPTIONS.find(t => t.value === safeOptions.terminology)?.label}</span></div>
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
  onOptionsChange: PropTypes.func.isRequired,
  debugId: PropTypes.string
};

export default SettingsPanel; 