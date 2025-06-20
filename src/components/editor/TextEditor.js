import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TextEditor = ({ value, onChange }) => {
  const [showGuide, setShowGuide] = useState(false);

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
      {/* 텍스트 입력 영역 - 고정 높이 유지 */}
      <div className="relative h-80">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="최적화할 텍스트를 입력해주세요...

예시:
• 학술: 연구 논문, 보고서, 학술 발표 자료
• 비즈니스: 제안서, 이메일, 프레젠테이션
• 기술: 매뉴얼, API 문서, 기술 블로그
• 일반: 블로그 글, 소개 글, 일반 문서"
        />
        <div className="absolute bottom-4 right-4 text-sm text-gray-500 bg-white px-2 py-1 rounded shadow-sm">
          {value.length}자
        </div>
      </div>
      
      {/* UX 가이드 섹션 - 입력창 아래로 확장 */}
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
        
        {/* 가이드 내용 - 애니메이션과 함께 확장 */}
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