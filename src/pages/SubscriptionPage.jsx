import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Card, Button, LoadingSpinner, Modal } from '../components/common';
import { useUser } from '../contexts/UserContext';
import { useStripe } from '../hooks/useStripe';
import { STRIPE_PLANS } from '../utils/stripe';
import { toast } from 'react-toastify';

// 구독 취소 모달 컴포넌트
const CancelSubscriptionModal = ({ isOpen, onClose, subscriptionData, onCancel }) => {
  const [cancelImmediately, setCancelImmediately] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!subscriptionData?.subscription?.id) {
      toast.error('구독 정보를 찾을 수 없습니다.');
      return;
    }

    setLoading(true);
    try {
      const success = await onCancel(subscriptionData.subscription.id, cancelImmediately);
      if (success) {
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="구독 취소">
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                구독 취소 안내
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>구독을 취소하시면 프리미엄 기능을 더 이상 이용하실 수 없습니다.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              id="cancel-period-end"
              type="radio"
              checked={!cancelImmediately}
              onChange={() => setCancelImmediately(false)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="cancel-period-end" className="ml-3 block text-sm font-medium text-gray-700">
              현재 결제 기간 종료 시 취소
              <p className="text-xs text-gray-500 mt-1">
                {subscriptionData?.subscription?.currentPeriodEnd && 
                  `${new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString('ko-KR')}까지 계속 이용 가능`
                }
              </p>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="cancel-immediately"
              type="radio"
              checked={cancelImmediately}
              onChange={() => setCancelImmediately(true)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
            />
            <label htmlFor="cancel-immediately" className="ml-3 block text-sm font-medium text-gray-700">
              즉시 취소
              <p className="text-xs text-gray-500 mt-1">
                지금 즉시 구독이 취소되며 프리미엄 기능 이용이 중단됩니다.
              </p>
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700"
          >
            {loading ? <LoadingSpinner size="sm" /> : '구독 취소'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const SubscriptionPage = () => {
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, userType } = useUser();
  const { 
    loading, 
    subscriptionData, 
    startCheckout, 
    openCustomerPortal, 
    cancelSubscriptionPlan,
    isSubscribed 
  } = useStripe();
  const [pageLoading, setPageLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);

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
            <div className="mt-6 p-6 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-green-800 font-semibold">
                    🎉 현재 <strong>프리미엄 플랜</strong>을 이용중입니다!
                  </p>
                  {subscriptionData.subscription?.currentPeriodEnd && (
                    <p className="text-green-700 text-sm mt-1">
                      다음 결제일: {new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString('ko-KR')}
                    </p>
                  )}
                  {subscriptionData.subscription?.cancelAtPeriodEnd && (
                    <p className="text-orange-600 text-sm mt-1 font-medium">
                      ⚠️ 구독이 {new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString('ko-KR')}에 종료 예정입니다.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openCustomerPortal}
                    disabled={loading}
                  >
                    구독 관리
                  </Button>
                  {!subscriptionData.subscription?.cancelAtPeriodEnd && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCancelModal(true)}
                      disabled={loading}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      구독 취소
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 구독 취소 모달 */}
        <CancelSubscriptionModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          subscriptionData={subscriptionData}
          onCancel={cancelSubscriptionPlan}
        />

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
                  <td className="py-4 px-6">AI 분석 엔진</td>
                  <td className="text-center py-4 px-6">기본 (Claude-3-Haiku)</td>
                  <td className="text-center py-4 px-6">고급 (Claude-3-Sonnet)</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">템플릿</td>
                  <td className="text-center py-4 px-6">3개</td>
                  <td className="text-center py-4 px-6">모든 템플릿</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">AI 코치</td>
                  <td className="text-center py-4 px-6">기본 과정</td>
                  <td className="text-center py-4 px-6">고급 과정</td>
                </tr>
                <tr>
                  <td className="py-4 px-6">지원</td>
                  <td className="text-center py-4 px-6">커뮤니티</td>
                  <td className="text-center py-4 px-6">우선 지원</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ 섹션 */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            자주 묻는 질문
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">언제든지 취소할 수 있나요?</h3>
              <p className="text-gray-600 text-sm">
                네, 언제든지 구독을 취소하실 수 있습니다. 취소 후에도 현재 결제 기간이 끝날 때까지는 프리미엄 기능을 계속 이용하실 수 있습니다.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">결제는 어떻게 이루어지나요?</h3>
              <p className="text-gray-600 text-sm">
                Stripe를 통해 안전하게 결제가 처리됩니다. 신용카드, 체크카드 등 다양한 결제 방법을 지원합니다.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">환불 정책은 어떻게 되나요?</h3>
              <p className="text-gray-600 text-sm">
                구독 후 7일 이내에는 전액 환불이 가능합니다. 그 이후에는 남은 기간에 대해 비례 환불해드립니다.
              </p>
            </Card>
            
            <Card className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">데이터는 안전하게 보관되나요?</h3>
              <p className="text-gray-600 text-sm">
                모든 데이터는 암호화되어 안전하게 저장됩니다. GDPR 및 개인정보보호법을 준수하여 운영됩니다.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionPage; 