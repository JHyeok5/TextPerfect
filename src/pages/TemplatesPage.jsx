import React from 'react';
import { Header, Footer, Card, Button } from '../components/common';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';

export default function TemplatesPage() {
  const { isAuthenticated, getUserPlan } = useUser();
  
  const templates = [
    {
      id: 1,
      title: '학술 논문',
      description: '연구 논문, 리포트, 학위 논문 등 학술적 글쓰기에 최적화된 템플릿',
      category: 'academic',
      usage: 245
    },
    {
      id: 2,
      title: '비즈니스 제안서',
      description: '사업 계획서, 제안서, 보고서 등 비즈니스 문서에 적합한 템플릿',
      category: 'business',
      usage: 189
    },
    {
      id: 3,
      title: '기술 문서',
      description: 'API 문서, 기술 가이드, 매뉴얼 등 기술적 내용 작성용 템플릿',
      category: 'technical',
      usage: 156
    },
    {
      id: 4,
      title: '마케팅 콘텐츠',
      description: '블로그 포스트, SNS 콘텐츠, 광고 카피 등 마케팅 자료용 템플릿',
      category: 'marketing',
      usage: 203
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <Header 
        title="템플릿" 
        subtitle="다양한 목적에 맞는 최적화 템플릿을 선택하세요." 
      />

      {/* 사용자 상태 안내 */}
      <div className="mb-8">
        <div className={`p-4 rounded-lg border ${
          userPlan === 'PREMIUM' ? 'bg-purple-50 border-purple-200' :
          isAuthenticated ? 'bg-blue-50 border-blue-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-800">
                {userPlan === 'PREMIUM' ? '🎯 프리미엄 플랜' :
                 isAuthenticated ? '📚 무료 플랜' :
                 '👋 비회원'}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {userPlan === 'PREMIUM' ? '모든 템플릿을 자유롭게 사용하실 수 있습니다.' :
                 isAuthenticated ? '기본 템플릿 3개를 사용하실 수 있습니다.' :
                 '로그인하시면 템플릿을 사용하실 수 있습니다.'}
              </p>
            </div>
            {userPlan !== 'PREMIUM' && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => window.location.href = '/subscription'}
              >
                {isAuthenticated ? '프리미엄 업그레이드' : '로그인하기'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card 
            key={template.id} 
            className={`relative ${
              template.isPremium && !canAccessPremium 
                ? 'opacity-60 cursor-not-allowed' 
                : 'hover:shadow-lg transition-shadow cursor-pointer'
            }`}
            onClick={() => handleTemplateClick(template)}
          >
            {/* 프리미엄 배지 */}
            {template.isPremium && (
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  canAccessPremium 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  PREMIUM
                </span>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                  {template.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{template.title}</h3>
                  <p className="text-sm text-gray-500">{template.usage}회 사용됨</p>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {template.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">
                  #{template.category}
                </span>
                <Button 
                  variant={template.isPremium && !canAccessPremium ? 'secondary' : 'primary'}
                  size="sm"
                  disabled={template.isPremium && !canAccessPremium}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTemplateClick(template);
                  }}
                >
                  {template.isPremium && !canAccessPremium ? '프리미엄 전용' : 
                   !isAuthenticated ? '로그인 필요' : '템플릿 사용'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 프리미엄 유도 섹션 */}
      {userPlan !== 'PREMIUM' && (
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            더 많은 템플릿이 필요하신가요?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            프리미엄 플랜으로 업그레이드하시면 마케팅, 창의적 글쓰기, 법률 문서 등 
            전문 템플릿을 포함해 총 6개의 모든 템플릿을 사용하실 수 있습니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500">✓</span>
              <span>모든 프리미엄 템플릿</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500">✓</span>
              <span>AI 고급 분석</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500">✓</span>
              <span>월 100개 문서</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-green-500">✓</span>
              <span>최대 10,000자</span>
            </div>
          </div>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.location.href = '/subscription'}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            프리미엄 플랜 시작하기
          </Button>
        </div>
      )}

      <Footer />
    </div>
  );
} 