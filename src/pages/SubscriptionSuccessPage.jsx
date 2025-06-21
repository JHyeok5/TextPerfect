import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useUser } from '../contexts/UserContext';
import { verifyCheckoutSession } from '../utils/stripe';
import { toast } from 'react-toastify';

const SubscriptionSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshUser } = useUser();
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifySession = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        setError('결제 세션 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        // 결제 세션 검증
        const data = await verifyCheckoutSession(sessionId);
        setSessionData(data);
        
        // 사용자 정보 새로고침 (구독 상태 업데이트)
        if (refreshUser) {
          await refreshUser();
        }
        
        toast.success('🎉 결제가 완료되었습니다! 프리미엄 기능을 이용해보세요.');
        
      } catch (error) {
        console.error('Session verification failed:', error);
        setError('결제 확인 중 오류가 발생했습니다.');
        toast.error('결제 확인 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [searchParams, refreshUser]);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col justify-center items-center min-h-[400px]">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">결제 정보를 확인하고 있습니다...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">결제 확인 실패</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-x-4">
              <Button onClick={() => navigate('/subscription')}>
                구독 페이지로 돌아가기
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                홈으로 가기
              </Button>
            </div>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          {/* 성공 아이콘 */}
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 결제 완료!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            프리미엄 플랜 구독이 성공적으로 완료되었습니다.
          </p>

          {/* 구독 정보 */}
          {sessionData && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-3">구독 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">플랜:</span>
                  <span className="font-medium">프리미엄</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제 금액:</span>
                  <span className="font-medium">₩{sessionData.amount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">결제일:</span>
                  <span className="font-medium">{new Date().toLocaleDateString('ko-KR')}</span>
                </div>
                {sessionData.nextBillingDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">다음 결제일:</span>
                    <span className="font-medium">
                      {new Date(sessionData.nextBillingDate).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 프리미엄 혜택 안내 */}
          <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
            <h3 className="font-semibold text-blue-900 mb-3">이제 이런 기능들을 이용하실 수 있습니다!</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                일일 10,000자 사용량
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                월 100개 문서 작성
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                고급 AI 분석 (Claude-3-Sonnet)
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                모든 템플릿 접근
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                AI 코치 고급 과정
              </li>
            </ul>
          </div>

          {/* 액션 버튼 */}
          <div className="space-y-3">
            <Button 
              className="w-full"
              onClick={() => navigate('/editor')}
            >
              지금 바로 글쓰기 시작하기
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard')}
              >
                대시보드 보기
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/subscription')}
              >
                구독 관리
              </Button>
            </div>
          </div>

          {/* 추가 안내 */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              구독 관리, 결제 내역 확인, 취소는 언제든지 구독 페이지에서 가능합니다.
            </p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default SubscriptionSuccessPage; 