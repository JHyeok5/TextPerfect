import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useUser } from '../contexts/UserContext';
import { useStripe } from '../hooks/useStripe';
import { STRIPE_PLANS } from '../utils/stripe';
import { toast } from 'react-toastify';

const SubscriptionPage = () => {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, userType } = useUser();
  const { 
    loading, 
    subscriptionData, 
    startCheckout, 
    openCustomerPortal, 
    isSubscribed 
  } = useStripe();
  const [pageLoading, setPageLoading] = useState(true);

  // URL 파라미터 확인 (결제 취소, 성공 등)
  useEffect(() => {
    const canceled = searchParams.get('canceled');
    const success = searchParams.get('success');
    
    if (canceled) {
      toast.warning('결제가 취소되었습니다.');
    }
    
    if (success) {
      toast.success('결제가 완료되었습니다! 프리미엄 기능을 이용해보세요.');
    }
    
    setPageLoading(false);
  }, [searchParams]);

  if (pageLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  const handlePlanSelect = async (planId) => {
    if (!isAuthenticated) {
      toast.error('결제를 위해 로그인이 필요합니다.');
      return;
    }
    
    await startCheckout(planId);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            요금제 선택
          </h1>
          <p className="text-xl text-gray-600">
            더 강력한 글쓰기 도구를 경험해보세요
          </p>
          
          {isSubscribed && subscriptionData && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800">
                🎉 현재 <strong>프리미엄 플랜</strong>을 이용중입니다!
                {subscriptionData.subscription?.currentPeriodEnd && (
                  <span className="ml-2">
                    (다음 결제일: {new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString('ko-KR')})
                  </span>
                )}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={openCustomerPortal}
                disabled={loading}
                className="mt-2"
              >
                구독 관리
              </Button>
            </div>
          )}
        </div>

        {/* 요금제 비교표 */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* 무료 플랜 */}
          <Card className="relative">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">무료 플랜</h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                ₩0
                <span className="text-lg font-normal text-gray-500">/월</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  일일 1,000자
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  월 10개 문서
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  기본 분석
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  기본 템플릿 3개
                </li>
              </ul>

              <Button 
                variant="outline" 
                className="w-full"
                disabled={!isAuthenticated || userType === 'FREE'}
              >
                {!isAuthenticated ? '로그인 후 이용' : userType === 'FREE' ? '현재 플랜' : '무료로 시작'}
              </Button>
            </div>
          </Card>

          {/* 프리미엄 월간 */}
          <Card className="relative border-2 border-blue-500 transform scale-105">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                인기
              </span>
            </div>
            
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {STRIPE_PLANS.PREMIUM_MONTHLY.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                ₩{formatPrice(STRIPE_PLANS.PREMIUM_MONTHLY.price)}
                <span className="text-lg font-normal text-gray-500">/월</span>
              </div>
              
              <ul className="space-y-3 mb-8">
                {STRIPE_PLANS.PREMIUM_MONTHLY.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full"
                onClick={() => handlePlanSelect('PREMIUM_MONTHLY')}
                disabled={loading || isSubscribed}
              >
                {loading ? '처리중...' : isSubscribed ? '구독중' : '월간 구독 시작'}
              </Button>
            </div>
          </Card>

          {/* 프리미엄 연간 */}
          <Card className="relative">
            <div className="absolute -top-4 right-4">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                {STRIPE_PLANS.PREMIUM_YEARLY.savings}
              </span>
            </div>
            
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {STRIPE_PLANS.PREMIUM_YEARLY.name}
              </h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">
                ₩{formatPrice(STRIPE_PLANS.PREMIUM_YEARLY.price)}
                <span className="text-lg font-normal text-gray-500">/년</span>
              </div>
              <div className="text-sm text-gray-500 mb-6">
                월 ₩{formatPrice(Math.floor(STRIPE_PLANS.PREMIUM_YEARLY.price / 12))} 상당
              </div>
              
              <ul className="space-y-3 mb-8">
                {STRIPE_PLANS.PREMIUM_YEARLY.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                variant="outline"
                className="w-full border-green-500 text-green-600 hover:bg-green-50"
                onClick={() => handlePlanSelect('PREMIUM_YEARLY')}
                disabled={loading || isSubscribed}
              >
                {loading ? '처리중...' : isSubscribed ? '구독중' : '연간 구독 시작'}
              </Button>
            </div>
          </Card>
        </div>

        {/* 기능 비교표 */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            상세 기능 비교
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">기능</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">무료</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">프리미엄</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6">일일 사용량</td>
                  <td className="text-center py-4 px-6">1,000자</td>
                  <td className="text-center py-4 px-6">10,000자</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">월 문서 수</td>
                  <td className="text-center py-4 px-6">10개</td>
                  <td className="text-center py-4 px-6">100개</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">AI 분석 품질</td>
                  <td className="text-center py-4 px-6">기본</td>
                  <td className="text-center py-4 px-6">고급 (Claude-3-Sonnet)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">템플릿</td>
                  <td className="text-center py-4 px-6">3개</td>
                  <td className="text-center py-4 px-6">전체 (6개+)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">AI 코치 과정</td>
                  <td className="text-center py-4 px-6">기본 1개</td>
                  <td className="text-center py-4 px-6">고급 3개 + 개인 맞춤</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">고객 지원</td>
                  <td className="text-center py-4 px-6">일반</td>
                  <td className="text-center py-4 px-6">우선 지원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            자주 묻는 질문
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">언제든 취소할 수 있나요?</h3>
              <p className="text-gray-600">
                네, 언제든지 구독을 취소할 수 있습니다. 취소 후에도 현재 결제 기간이 끝날 때까지는 프리미엄 기능을 계속 이용하실 수 있습니다.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">결제 수단은 무엇을 지원하나요?</h3>
              <p className="text-gray-600">
                신용카드, 체크카드를 지원합니다. 모든 결제는 Stripe를 통해 안전하게 처리됩니다.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">무료 체험이 있나요?</h3>
              <p className="text-gray-600">
                무료 플랜으로 먼저 서비스를 체험해보실 수 있습니다. 별도의 무료 체험 기간은 제공하지 않습니다.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">환불 정책은 어떻게 되나요?</h3>
              <p className="text-gray-600">
                구독 후 7일 이내에 요청하시면 전액 환불해드립니다. 자세한 내용은 고객센터로 문의해주세요.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionPage; 