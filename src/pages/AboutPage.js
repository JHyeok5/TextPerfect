import React from 'react';
import { Header, Footer, Card } from '../components/common';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'AI 개발팀',
      role: '핵심 AI 알고리즘 개발',
      description: '자연어 처리와 텍스트 분석 전문가들이 모여 최고 품질의 AI 엔진을 만들고 있습니다.'
    },
    {
      name: 'UX/UI 팀',
      role: '사용자 경험 설계',
      description: '직관적이고 효율적인 인터페이스로 누구나 쉽게 사용할 수 있는 서비스를 만듭니다.'
    },
    {
      name: '언어학 전문가',
      role: '언어 품질 검증',
      description: '다양한 언어학적 관점에서 AI의 분석 결과를 검증하고 개선합니다.'
    }
  ];

  const values = [
    {
      title: '혁신',
      description: '최신 AI 기술을 활용하여 글쓰기의 새로운 가능성을 탐구합니다.',
      icon: '💡'
    },
    {
      title: '품질',
      description: '정확하고 신뢰할 수 있는 분석 결과를 제공하기 위해 끊임없이 노력합니다.',
      icon: '⭐'
    },
    {
      title: '접근성',
      description: '누구나 쉽게 사용할 수 있는 직관적인 서비스를 만듭니다.',
      icon: '🌍'
    },
    {
      title: '성장',
      description: '사용자의 글쓰기 실력 향상을 돕는 것이 우리의 궁극적인 목표입니다.',
      icon: '📈'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <Header 
        title="TextPerfect 소개" 
        subtitle="AI 기반 텍스트 최적화 서비스에 대해 알아보세요." 
      />

      <div className="space-y-8">
        {/* 서비스 소개 */}
        <Card>
          <div className="p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              AI와 함께하는 완벽한 글쓰기
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              TextPerfect는 Claude AI 기술을 활용하여 당신의 글을 더 명확하고, 전문적이며, 
              매력적으로 만드는 혁신적인 텍스트 최적화 서비스입니다. 
              학술, 비즈니스, 기술 등 다양한 목적에 맞게 글의 품질을 향상시켜 드립니다.
            </p>
          </div>
        </Card>

        {/* 핵심 가치 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">혁신</h3>
            <p className="text-gray-600">
              최신 AI 기술을 활용하여 지속적으로 발전하는 텍스트 최적화 솔루션을 제공합니다.
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">사용자 중심</h3>
            <p className="text-gray-600">
              사용자의 편의성과 만족도를 최우선으로 생각하며 직관적인 인터페이스를 제공합니다.
            </p>
          </Card>

          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">품질</h3>
            <p className="text-gray-600">
              높은 품질의 텍스트 최적화를 통해 사용자의 커뮤니케이션 효과를 극대화합니다.
            </p>
          </Card>
        </div>

        {/* 기술 스택 */}
        <Card>
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">기술 스택</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">AI & 백엔드</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Claude 3.5 Sonnet - 최신 대화형 AI 모델</li>
                  <li>• Netlify Functions - 서버리스 백엔드</li>
                  <li>• 자연어 처리 알고리즘</li>
                  <li>• 실시간 텍스트 분석</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">프론트엔드</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• React 18 - 모던 웹 프레임워크</li>
                  <li>• Tailwind CSS - 유틸리티 기반 스타일링</li>
                  <li>• 반응형 웹 디자인</li>
                  <li>• 최적화된 사용자 경험</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* 연락처 */}
        <Card>
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">문의하기</h2>
            <p className="text-gray-600 mb-6">
              TextPerfect에 대한 문의사항이나 제안이 있으시면 언제든 연락해 주세요.
            </p>
            <div className="flex justify-center space-x-8">
              <div>
                <div className="text-sm text-gray-500">이메일</div>
                <div className="font-medium">contact@textperfect.com</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">지원 시간</div>
                <div className="font-medium">평일 9:00 - 18:00</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
} 