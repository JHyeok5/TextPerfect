import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
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
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">구독 관리</h1>
        <p className="text-gray-600">현재 구독 상태를 확인하고 플랜을 변경하세요.</p>
      </div>

      {/* 현재 구독 상태 */}
      <Card className="mb-8">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">현재 구독 상태</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <span className="text-sm text-gray-600">현재 플랜</span>
                <div className="flex items-center mt-1">
                  <span className={`text-2xl font-bold ${
                    userType === 'FREE' ? 'text-gray-600' : 'text-blue-600'
                  }`}>
                    {userType === 'FREE' ? '무료 플랜' : '프리미엄 플랜'}
                  </span>
                  {userType === 'PREMIUM' && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      PRO
                    </span>
                  )}
                </div>
              </div>
              
              {subscriptionData?.subscription && (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">상태</span>
                    <span className={`font-medium ${
                      subscriptionData.subscription.status === 'active' ? 'text-green-600' : 
                      subscriptionData.subscription.status === 'canceled' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {getStatusText(subscriptionData.subscription.status)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      {subscriptionData.subscription.cancelAtPeriodEnd ? '서비스 종료일' : '다음 결제일'}
                    </span>
                    <span className="font-medium">
                      {new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  
                  {subscriptionData.subscription.cancelAtPeriodEnd && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm text-yellow-800">
                        구독이 취소되었습니다. {new Date(subscriptionData.subscription.currentPeriodEnd).toLocaleDateString('ko-KR')}까지 프리미엄 기능을 이용할 수 있습니다.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div>
              <div className="mb-4">
                <span className="text-sm text-gray-600">이번 달 사용량</span>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>문서 분석</span>
                    <span>{subscriptionData?.usage?.monthlyDocs || 0} / {userType === 'FREE' ? 10 : 100}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${Math.min(((subscriptionData?.usage?.monthlyDocs || 0) / (userType === 'FREE' ? 10 : 100)) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">일일 문자 제한</span>
                  <span className="font-medium">{userType === 'FREE' ? '1,000자' : '10,000자'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">최대 텍스트 길이</span>
                  <span className="font-medium">{userType === 'FREE' ? '3,000자' : '10,000자'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* 구독 관리 버튼들 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              {userType === 'FREE' ? (
                <Button 
                  variant="primary"
                  onClick={() => handlePlanSelect('PREMIUM_MONTHLY')}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" /> : '프리미엄으로 업그레이드'}
                </Button>
              ) : (
                <>
                  {!subscriptionData?.subscription?.cancelAtPeriodEnd && (
                    <Button 
                      variant="secondary"
                      onClick={() => setShowCancelModal(true)}
                      disabled={loading}
                    >
                      구독 취소
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline"
                    onClick={openCustomerPortal}
                    disabled={loading}
                  >
                    결제 정보 관리
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* 플랜 비교 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 무료 플랜 */}
        <Card className={`relative ${userType === 'FREE' ? 'ring-2 ring-blue-500' : ''}`}>
          <div className="p-6">
            {userType === 'FREE' && (
              <div className="absolute top-4 right-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  현재 플랜
                </span>
              </div>
            )}
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">무료 플랜</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              ₩0<span className="text-base font-normal text-gray-600">/월</span>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                월 10개 문서 분석
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                일일 1,000자 제한
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                최대 3,000자 텍스트
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                기본 템플릿 이용
              </li>
            </ul>
            
            {userType !== 'FREE' && (
              <Button variant="outline" className="w-full" disabled>
                현재 플랜 아님
              </Button>
            )}
          </div>
        </Card>

        {/* 프리미엄 플랜 */}
        <Card className={`relative ${userType === 'PREMIUM' ? 'ring-2 ring-blue-500' : ''}`}>
          <div className="p-6">
            {userType === 'PREMIUM' && (
              <div className="absolute top-4 right-4">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  현재 플랜
                </span>
              </div>
            )}
            
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                추천
              </span>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">프리미엄 플랜</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              ₩{formatPrice(STRIPE_PLANS.PREMIUM_MONTHLY.price)}
              <span className="text-base font-normal text-gray-600">/월</span>
            </div>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                월 100개 문서 분석
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                일일 10,000자 제한
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                최대 10,000자 텍스트
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                모든 템플릿 이용
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                우선 고객 지원
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                고급 분석 기능
              </li>
            </ul>
            
            {userType === 'FREE' ? (
              <Button 
                variant="primary" 
                className="w-full"
                onClick={() => handlePlanSelect('PREMIUM_MONTHLY')}
                disabled={loading}
              >
                {loading ? <LoadingSpinner size="sm" /> : '업그레이드'}
              </Button>
            ) : (
              <Button variant="outline" className="w-full" disabled>
                현재 이용 중
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* 구독 취소 모달 */}
      <CancelSubscriptionModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        subscriptionData={subscriptionData}
        onCancel={cancelSubscriptionPlan}
      />
    </div>
  );
};

export default SubscriptionPage; 