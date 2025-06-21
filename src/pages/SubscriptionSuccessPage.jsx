import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, Button, LoadingSpinner } from '../components/common';
import { useUser } from '../contexts/UserContext';
import { useStripe } from '../hooks/useStripe';

export default function SubscriptionSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, setSubscription } = useUser();
  const { getSubscription } = useStripe();
  const [loading, setLoading] = useState(true);
  const [subscriptionData, setSubscriptionData] = useState(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      if (!sessionId) {
        navigate('/subscription');
        return;
      }

      try {
        setLoading(true);
        // 구독 정보 새로고침
        const data = await getSubscription();
        if (data) {
          setSubscriptionData(data);
          setSubscription(data.subscription);
        }
      } catch (error) {
        console.error('Failed to fetch subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [sessionId, getSubscription, setSubscription, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center">
        {/* 성공 아이콘 */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 구독이 완료되었습니다!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          TextPerfect 프리미엄을 이용해주셔서 감사합니다.<br />
          이제 더욱 강력한 AI 글쓰기 도구를 경험해보세요!
        </p>

        {/* 구독 정보 카드 */}
        <Card className="mb-8 text-left">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">구독 정보</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">플랜</span>
                <span className="font-medium text-blue-600">프리미엄</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">사용자</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              
              {subscriptionData?.subscription && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">시작일</span>
                    <span className="font-medium">
                      {new Date(subscriptionData.subscription.currentPeriodStart).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">다음 결제일</span>
                    <span className="font-medium">
                      {new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* 프리미엄 혜택 */}
        <Card className="mb-8 text-left">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">이제 이용할 수 있는 혜택</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">월 100개 문서</p>
                  <p className="text-sm text-gray-600">무제한에 가까운 분석</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">일일 10,000자</p>
                  <p className="text-sm text-gray-600">대용량 텍스트 처리</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">모든 템플릿</p>
                  <p className="text-sm text-gray-600">다양한 글쓰기 템플릿</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75A9.75 9.75 0 0112 2.25z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">우선 지원</p>
                  <p className="text-sm text-gray-600">빠른 고객 서비스</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/editor')}
          >
            에디터에서 시작하기
          </Button>
          
          <Button 
            variant="secondary" 
            size="lg"
            onClick={() => navigate('/dashboard')}
          >
            대시보드로 이동
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => navigate('/subscription')}
          >
            구독 관리
          </Button>
        </div>

        {/* 도움말 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>팁:</strong> 프리미엄 기능을 최대한 활용하려면 에디터에서 긴 텍스트를 분석해보거나, 
            다양한 템플릿을 사용해보세요!
          </p>
        </div>
      </div>
    </div>
  );
} 