import React, { useState } from 'react';
import { Header, Footer, Card, Button, ProgressBar } from '../components/common';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';

export default function CoachingPage() {
  const { isAuthenticated, getUserPlan } = useUser();
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const userPlan = getUserPlan();
  const canAccessPremium = userPlan === 'PREMIUM';

  const courses = [
    {
      id: 1,
      title: '기본 글쓰기 과정',
      description: '문장 구성, 기본 문법, 가독성 향상 등 글쓰기의 기초를 배웁니다.',
      level: 'beginner',
      duration: '2주',
      lessons: 8,
      isPremium: false,
      icon: '📝',
      progress: 75
    },
    {
      id: 2,
      title: '비즈니스 글쓰기',
      description: '제안서, 보고서, 이메일 등 비즈니스 상황에서의 효과적인 글쓰기를 학습합니다.',
      level: 'intermediate',
      duration: '3주',
      lessons: 12,
      isPremium: true,
      icon: '💼',
      progress: 0
    },
    {
      id: 3,
      title: '창의적 글쓰기',
      description: '스토리텔링, 창작 기법, 독자의 감정을 움직이는 글쓰기 방법을 익힙니다.',
      level: 'advanced',
      duration: '4주',
      lessons: 16,
      isPremium: true,
      icon: '✨',
      progress: 0
    },
    {
      id: 4,
      title: '학술 글쓰기',
      description: '논문, 연구보고서 등 학술적 글쓰기의 구조와 표현법을 마스터합니다.',
      level: 'advanced',
      duration: '4주',
      lessons: 14,
      isPremium: true,
      icon: '🎓',
      progress: 0
    }
  ];

  const handleCourseClick = (course) => {
    if (course.isPremium && !canAccessPremium) {
      toast.error('프리미엄 플랜에서만 이용 가능한 과정입니다.');
      return;
    }

    if (!isAuthenticated) {
      toast.error('로그인 후 AI 코치 과정을 수강할 수 있습니다.');
      return;
    }

    setSelectedCourse(course);
    toast.success(`${course.title} 과정을 선택했습니다!`);
  };

  const getLevelBadge = (level) => {
    const badges = {
      beginner: { text: '초급', color: 'bg-green-100 text-green-700' },
      intermediate: { text: '중급', color: 'bg-yellow-100 text-yellow-700' },
      advanced: { text: '고급', color: 'bg-red-100 text-red-700' }
    };
    return badges[level] || badges.beginner;
  };

  return (
    <div className="max-w-7xl mx-auto">
      <Header 
        title="AI 글쓰기 코치" 
        subtitle="개인 맞춤형 AI 코치와 함께 글쓰기 실력을 체계적으로 향상시키세요." 
      />

      {/* 사용자 상태 안내 */}
      <div className="mb-8">
        <div className={`p-6 rounded-lg border ${
          userPlan === 'PREMIUM' ? 'bg-purple-50 border-purple-200' :
          isAuthenticated ? 'bg-blue-50 border-blue-200' :
          'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {userPlan === 'PREMIUM' ? '🎯 프리미엄 AI 코치' :
                 isAuthenticated ? '📚 기본 AI 코치' :
                 '👋 AI 코치 체험'}
              </h3>
              <p className="text-gray-600">
                {userPlan === 'PREMIUM' ? '모든 고급 코칭 과정과 개인 맞춤 피드백을 이용하실 수 있습니다.' :
                 isAuthenticated ? '기본 글쓰기 과정을 수강하실 수 있습니다.' :
                 '로그인하시면 AI 코치 과정을 수강하실 수 있습니다.'}
              </p>
              {userPlan === 'PREMIUM' && (
                <div className="flex items-center gap-4 mt-3 text-sm text-purple-700">
                  <span>✓ 개인 맞춤 분석</span>
                  <span>✓ 실시간 피드백</span>
                  <span>✓ 고급 과정 무제한</span>
                  <span>✓ 1:1 AI 멘토링</span>
                </div>
              )}
            </div>
            {userPlan !== 'PREMIUM' && (
              <Button 
                variant="primary" 
                onClick={() => window.location.href = '/subscription'}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                {isAuthenticated ? '프리미엄 업그레이드' : '로그인하기'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 코스 목록 */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">AI 코칭 과정</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => {
              const levelBadge = getLevelBadge(course.level);
              const isAccessible = !course.isPremium || canAccessPremium;
              
              return (
                <Card 
                  key={course.id}
                  className={`relative ${
                    !isAccessible 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:shadow-lg transition-shadow cursor-pointer'
                  } ${selectedCourse?.id === course.id ? 'ring-2 ring-blue-500' : ''}`}
                  onClick={() => handleCourseClick(course)}
                >
                  {/* 프리미엄 배지 */}
                  {course.isPremium && (
                    <div className="absolute top-4 right-4">
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
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                        {course.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{course.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${levelBadge.color}`}>
                            {levelBadge.text}
                          </span>
                          <span className="text-xs text-gray-500">{course.duration} • {course.lessons}강</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {course.description}
                    </p>
                    
                    {/* 진행률 (기본 과정만) */}
                    {!course.isPremium && course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>진행률</span>
                          <span>{course.progress}%</span>
                        </div>
                        <ProgressBar value={course.progress} max={100} />
                      </div>
                    )}
                    
                    <Button 
                      variant={!isAccessible ? 'secondary' : 'primary'}
                      size="sm"
                      disabled={!isAccessible}
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseClick(course);
                      }}
                    >
                      {!isAccessible ? '프리미엄 전용' : 
                       !isAuthenticated ? '로그인 필요' : 
                       course.progress > 0 ? '계속 학습' : '과정 시작'}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* 사이드바 - 학습 현황 및 AI 피드백 */}
        <div className="space-y-6">
          {/* 학습 진행도 */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">학습 현황</h3>
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">현재 과정</div>
                    <div className="font-medium">{selectedCourse?.title || '기본 글쓰기 과정'}</div>
                    <div className="mt-2">
                      <ProgressBar value={selectedCourse?.progress || 75} max={100} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">8</div>
                      <div className="text-xs text-gray-600">완료한 강의</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="text-lg font-bold text-purple-600">24</div>
                      <div className="text-xs text-gray-600">학습 시간</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">🔒</div>
                  <p className="text-gray-600 text-sm">로그인하시면 학습 현황을 확인할 수 있습니다.</p>
                </div>
              )}
            </div>
          </Card>

          {/* AI 피드백 */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">최근 AI 피드백</h3>
              {canAccessPremium ? (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        AI
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">2시간 전</div>
                        <p className="text-gray-800 text-sm">
                          "최근 작성하신 문서에서 문장의 길이가 일정하게 유지되어 읽기 좋았습니다. 
                          다음에는 연결어를 더 다양하게 사용해보시면 글의 흐름이 더욱 자연스러워질 것 같아요."
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        AI
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 mb-1">1일 전</div>
                        <p className="text-gray-800 text-sm">
                          "전문 용어 사용이 적절했습니다! 독자가 이해하기 쉽도록 설명을 추가하신 부분이 특히 좋았어요."
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">🤖</div>
                  <p className="text-gray-600 text-sm mb-3">
                    {isAuthenticated ? 
                      '프리미엄 플랜에서 개인 맞춤 AI 피드백을 받으실 수 있습니다.' :
                      '로그인하시면 AI 피드백을 받으실 수 있습니다.'
                    }
                  </p>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => window.location.href = isAuthenticated ? '/subscription' : '/login'}
                  >
                    {isAuthenticated ? '프리미엄 업그레이드' : '로그인하기'}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* 개인 맞춤 추천 */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">맞춤 추천</h3>
              {canAccessPremium ? (
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    최근 작성한 글을 분석한 결과, 문단 구성 연습이 필요해 보입니다.
                  </p>
                  <Button variant="primary" size="sm" className="w-full">
                    맞춤 연습 시작
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-gray-400 mb-2">🎯</div>
                  <p className="text-gray-600 text-xs">
                    프리미엄 플랜에서 개인 맞춤 추천을 받으실 수 있습니다.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* 프리미엄 유도 섹션 */}
      {userPlan !== 'PREMIUM' && (
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            전문 AI 코치와 함께 성장하세요
          </h3>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            프리미엄 플랜으로 업그레이드하시면 비즈니스, 창의적 글쓰기, 학술 글쓰기 등 
            전문 과정과 개인 맞춤 AI 피드백을 받으실 수 있습니다.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sm font-medium text-gray-800">개인 맞춤 분석</div>
              <div className="text-xs text-gray-600 mt-1">AI가 당신의 글쓰기 패턴을 분석</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">🤖</div>
              <div className="text-sm font-medium text-gray-800">실시간 피드백</div>
              <div className="text-xs text-gray-600 mt-1">즉시 개선점과 칭찬 메시지</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">📚</div>
              <div className="text-sm font-medium text-gray-800">고급 과정 무제한</div>
              <div className="text-xs text-gray-600 mt-1">모든 전문 과정 자유 수강</div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="text-2xl mb-2">💬</div>
              <div className="text-sm font-medium text-gray-800">1:1 AI 멘토링</div>
              <div className="text-xs text-gray-600 mt-1">개인별 맞춤 학습 계획</div>
            </div>
          </div>
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => window.location.href = '/subscription'}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            프리미엄 AI 코치 시작하기
          </Button>
        </div>
      )}

      <Footer />
    </div>
  );
} 