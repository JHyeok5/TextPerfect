import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { useStripe } from '../hooks/useStripe';
import { Card, Button, LoadingSpinner, ProgressBar, Badge } from '../components/common';

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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-6">대시보드를 이용하려면 먼저 로그인해주세요.</p>
          <Button variant="primary" onClick={() => navigate('/login')}>로그인하기</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  const currentLimits = USAGE_LIMITS[userType] || USAGE_LIMITS.GUEST;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 환영 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          안녕하세요, {user?.nickname || user?.name || user?.email?.split('@')[0] || '사용자'}님! 👋
        </h1>
        <p className="text-gray-600">오늘도 완벽한 텍스트를 만들어보세요.</p>
      </div>

      {/* 주요 통계 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">최적화한 문서</p>
              <p className="text-2xl font-bold text-gray-900">{user?.stats?.optimizedDocs || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">개선한 문장</p>
              <p className="text-2xl font-bold text-gray-900">{user?.stats?.improvedSentences || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">평균 개선도</p>
              <p className="text-2xl font-bold text-gray-900">{user?.stats?.avgImprovement || 0}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">연속 사용일</p>
              <p className="text-2xl font-bold text-gray-900">{user?.stats?.consecutiveDays || 0}일</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 레벨 및 경험치 */}
        <Card className="lg:col-span-1">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">내 레벨</h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                Lv.{user?.level || 1}
              </div>
              <Badge variant="primary">{user?.subscription?.plan || 'FREE'}</Badge>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>경험치</span>
                <span>{user?.exp || 0} / 1000</span>
              </div>
              <ProgressBar value={user?.exp || 0} max={1000} />
            </div>
            <p className="text-sm text-gray-600 text-center">
              다음 레벨까지 {1000 - (user?.exp || 0)} XP
            </p>
          </div>
        </Card>

        {/* 빠른 시작 */}
        <Card className="lg:col-span-2">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 시작</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="primary" className="h-20 flex flex-col items-center justify-center">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                <span>새 문서 작성</span>
              </Button>
              
              <Button variant="secondary" className="h-20 flex flex-col items-center justify-center">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>분석 보기</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>템플릿 보기</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <span>구독 관리</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 최근 활동 */}
      <Card className="mt-8">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900">새로운 문서를 최적화했습니다</p>
                <p className="text-sm text-gray-500">2시간 전</p>
              </div>
            </div>
            
            <div className="text-center py-8 text-gray-500">
              <p>더 많은 활동을 위해 새 문서를 작성해보세요!</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage; 