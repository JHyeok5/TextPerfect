import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useUser } from '../contexts/UserContext';
import { useStripe } from '../hooks/useStripe';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { 
    user, 
    userType, 
    isAuthenticated, 
    dailyUsage, 
    monthlyDocs, 
    getDailyUsagePercentage,
    getDocsUsagePercentage,
    getRemainingDocs,
    USAGE_LIMITS
  } = useUser();
  const { subscriptionData, isSubscribed } = useStripe();
  
  const [stats, setStats] = useState({
    totalDocuments: 0,
    totalCharacters: 0,
    averageScore: 0,
    improvementRate: 0,
    weeklyActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 사용자 통계 데이터 로드
    const loadUserStats = async () => {
      try {
        // 로컬 스토리지에서 사용자 활동 데이터 로드
        const savedStats = localStorage.getItem(`userStats_${user?.id}`);
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
        
        // 주간 활동 데이터 생성 (임시)
        const weeklyData = generateWeeklyActivity();
        setStats(prev => ({ ...prev, weeklyActivity: weeklyData }));
        
      } catch (error) {
        console.error('Failed to load user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && user?.id) {
      loadUserStats();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  // 주간 활동 데이터 생성 (임시)
  const generateWeeklyActivity = () => {
    const days = ['월', '화', '수', '목', '금', '토', '일'];
    return days.map(day => ({
      day,
      documents: Math.floor(Math.random() * 5),
      characters: Math.floor(Math.random() * 2000)
    }));
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              로그인이 필요합니다
            </h1>
            <p className="text-gray-600 mb-6">
              대시보드를 이용하려면 먼저 로그인해주세요.
            </p>
            <Button onClick={() => navigate('/login')}>
              로그인하기
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  const currentLimits = USAGE_LIMITS[userType] || USAGE_LIMITS.GUEST;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            안녕하세요, {user?.name || user?.email?.split('@')[0]}님! 👋
          </h1>
          <p className="text-gray-600">
            TextPerfect 대시보드에 오신 것을 환영합니다.
          </p>
        </div>

        {/* 구독 상태 알림 */}
        {!isSubscribed && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">프리미엄으로 업그레이드하세요!</h3>
                <p className="text-blue-700 text-sm">더 많은 기능과 무제한 사용량을 경험해보세요.</p>
              </div>
              <Button onClick={() => navigate('/subscription')}>
                업그레이드
              </Button>
            </div>
          </div>
        )}

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* 오늘 사용량 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">오늘 사용량</h3>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {dailyUsage.toLocaleString()}자
            </div>
            <div className="text-sm text-gray-600 mb-3">
              / {currentLimits.dailyChars.toLocaleString()}자
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(getDailyUsagePercentage(), 100)}%` }}
              ></div>
            </div>
          </Card>

          {/* 이번 달 문서 수 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">이번 달 문서</h3>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {monthlyDocs}개
            </div>
            <div className="text-sm text-gray-600 mb-3">
              / {currentLimits.monthlyDocs}개
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(getDocsUsagePercentage(), 100)}%` }}
              ></div>
            </div>
          </Card>

          {/* 총 작성 문자 수 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">총 작성량</h3>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.totalCharacters.toLocaleString()}자
            </div>
            <div className="text-sm text-gray-600">
              누적 작성량
            </div>
          </Card>

          {/* 평균 점수 */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">평균 점수</h3>
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {stats.averageScore}/100
            </div>
            <div className="text-sm text-gray-600">
              글쓰기 품질 점수
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 주간 활동 차트 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              주간 활동
            </h3>
            <div className="space-y-4">
              {stats.weeklyActivity.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 w-8">{day.day}</span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.max((day.characters / 2000) * 100, 5)}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 w-16 text-right">
                    {day.characters}자
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* 계정 정보 */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              계정 정보
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">이메일</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">플랜</span>
                <div className="flex items-center space-x-2">
                  <span className={`font-medium ${
                    userType === 'PREMIUM' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {userType === 'PREMIUM' ? '프리미엄' : '무료'}
                  </span>
                  {userType === 'PREMIUM' && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      PRO
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">가입일</span>
                <span className="font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}
                </span>
              </div>
              
              {subscriptionData?.subscription && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">다음 결제일</span>
                  <span className="font-medium">
                    {new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              )}
              
              <div className="pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/profile')}
                >
                  프로필 관리
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* 빠른 액션 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            빠른 시작
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/editor')}
              className="text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div className="font-medium text-gray-900">새 글 작성</div>
              </div>
              <div className="text-sm text-gray-600">
                에디터에서 새로운 글을 작성해보세요
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/templates')}
              className="text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v0a2 2 0 002 2h14a2 2 0 002-2v0a2 2 0 00-2-2" />
                  </svg>
                </div>
                <div className="font-medium text-gray-900">템플릿 사용</div>
              </div>
              <div className="text-sm text-gray-600">
                다양한 템플릿으로 빠르게 시작하세요
              </div>
            </button>
            
            <button 
              onClick={() => navigate('/coaching')}
              className="text-left p-4 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="font-medium text-gray-900">AI 코치</div>
              </div>
              <div className="text-sm text-gray-600">
                글쓰기 실력을 향상시켜보세요
              </div>
            </button>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage; 