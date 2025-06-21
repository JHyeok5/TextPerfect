import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useUser } from '../../contexts/UserContext';

const TextEditor = ({ value, onChange }) => {
  const [showGuide, setShowGuide] = useState(false);
  const { 
    isAuthenticated, 
    dailyUsage, 
    getRemainingCharacters, 
    getUsagePercentage, 
    getMaxTextLength,
    getUserPlan,
    USAGE_LIMITS 
  } = useUser();

  const plan = getUserPlan();
  const maxLength = getMaxTextLength();
  const remainingChars = getRemainingCharacters();
  const usagePercentage = getUsagePercentage();
  const currentLength = value.length;
  
  // 글자수 제한 체크
  const isOverLength = currentLength > maxLength;
  const isNearLimit = currentLength > maxLength * 0.8;
  
  // 일일 사용량 제한 체크
  const isOverDailyLimit = usagePercentage >= 100;
  const isNearDailyLimit = usagePercentage >= 80;

  const handleTextChange = (newValue) => {
    // 최대 길이 제한
    if (newValue.length <= maxLength) {
      onChange(newValue);
    }
  };

  const getCharCountColor = () => {
    if (isOverLength) return 'text-red-600';
    if (isNearLimit) return 'text-orange-600';
    return 'text-gray-500';
  };

  const getUsageBarColor = () => {
    if (isOverDailyLimit) return 'bg-red-500';
    if (isNearDailyLimit) return 'bg-orange-500';
    return 'bg-blue-500';
  };

  const tips = [
    {
      icon: "💡",
      title: "명확한 목적 설정",
      desc: "왼쪽 옵션에서 텍스트의 목적(학술, 비즈니스 등)을 정확히 선택하세요."
    },
    {
      icon: "📝",
      title: "충분한 텍스트 길이",
      desc: "최소 50자 이상의 텍스트를 입력하면 더 정확한 최적화가 가능합니다."
    },
    {
      icon: "🎯",
      title: "구체적인 내용",
      desc: "추상적인 표현보다는 구체적이고 명확한 내용일수록 좋은 결과를 얻을 수 있습니다."
    },
    {
      icon: "⚙️",
      title: "세부 옵션 활용",
      desc: "격식도와 간결성을 조정하여 원하는 톤앤매너로 최적화하세요."
    }
  ];

  return (
    <div className="w-full">
      {/* 사용량 정보 표시 */}
      {isAuthenticated && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                오늘의 사용량 ({plan} 플랜)
              </span>
              {plan === 'FREE' && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  무료
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600">
              {dailyUsage} / {USAGE_LIMITS[plan]?.dailyCharacters || 1000}자
            </div>
          </div>
          
          {/* 사용량 진행 바 */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getUsageBarColor()}`}
              style={{ width: `${Math.min(100, usagePercentage)}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500">
              남은 사용량: {remainingChars}자
            </span>
            {isNearDailyLimit && (
              <span className="text-xs text-orange-600 font-medium">
                ⚠️ 사용량이 부족합니다
              </span>
            )}
            {isOverDailyLimit && (
              <span className="text-xs text-red-600 font-medium">
                ❌ 일일 사용량 초과
              </span>
            )}
          </div>
        </div>
      )}

      {/* 비로그인 사용자 안내 */}
      {!isAuthenticated && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <span className="text-blue-600">ℹ️</span>
            <span className="text-sm font-medium text-blue-800">
              로그인하면 더 많은 기능을 사용할 수 있습니다
            </span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            무료 회원: 일일 1,000자 | 프리미엄: 일일 10,000자
          </p>
        </div>
      )}

      {/* 텍스트 입력 영역 */}
      <div className="relative h-80">
        <textarea
          value={value}
          onChange={(e) => handleTextChange(e.target.value)}
          className={`w-full h-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
            isOverLength 
              ? 'border-red-300 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          placeholder="최적화할 텍스트를 입력해주세요...

예시:
• 학술: 연구 논문, 보고서, 학술 발표 자료
• 비즈니스: 제안서, 이메일, 프레젠테이션
• 기술: 매뉴얼, API 문서, 기술 블로그
• 일반: 블로그 글, 소개 글, 일반 문서"
          disabled={isOverDailyLimit}
        />
        
        {/* 글자수 표시 */}
        <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-lg shadow-sm border">
          <span className={`text-sm font-medium ${getCharCountColor()}`}>
            {currentLength.toLocaleString()} / {maxLength.toLocaleString()}자
          </span>
          {isOverLength && (
            <div className="text-xs text-red-600 mt-1">
              최대 길이를 초과했습니다
            </div>
          )}
        </div>
      </div>
      
      {/* 제한 안내 메시지 */}
      {isOverDailyLimit && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-red-600">🚫</span>
            <span className="text-sm font-medium text-red-800">
              일일 사용량을 모두 사용했습니다
            </span>
          </div>
          <p className="text-xs text-red-700 mt-1">
            내일 다시 이용하시거나 프리미엄 플랜으로 업그레이드하세요.
          </p>
        </div>
      )}
      
      {/* UX 가이드 섹션 */}
      <div className="mt-4 border-t pt-4">
        <button
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <span className={`transform transition-transform ${showGuide ? 'rotate-90' : ''}`}>
            ▶
          </span>
          <span className="font-medium">효과적인 텍스트 최적화 가이드</span>
        </button>
        
        {/* 가이드 내용 */}
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showGuide ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {tips.map((tip, index) => (
              <div key={index} className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <span className="text-lg flex-shrink-0">{tip.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-800 text-sm mb-1">{tip.title}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* 추가 주의사항 */}
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-amber-600 text-sm">⚠️</span>
              <div className="text-xs text-amber-800">
                <strong>주의사항:</strong> 개인정보나 민감한 정보는 입력하지 마세요. 
                최적화 과정에서 텍스트가 외부 AI 서비스로 전송될 수 있습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default TextEditor; 