import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { 
  createCheckoutSession, 
  createCustomerPortalSession, 
  getSubscriptionStatus,
  getStripe 
} from '../utils/stripe';
import { toast } from 'react-toastify';

export const useStripe = () => {
  const { user, isAuthenticated } = useUser();
  const [loading, setLoading] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);

  // 구독 상태 조회
  const fetchSubscriptionStatus = async () => {
    if (!isAuthenticated || !user?.email) return;

    try {
      setLoading(true);
      const data = await getSubscriptionStatus(user.email);
      setSubscriptionData(data);
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
      toast.error('구독 상태를 조회하는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 결제 시작
  const startCheckout = async (planType) => {
    if (!isAuthenticated) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (!user?.id || !user?.email) {
      toast.error('사용자 정보가 없습니다.');
      return;
    }

    try {
      setLoading(true);
      
      // 체크아웃 세션 생성
      const { url } = await createCheckoutSession(planType, user.id, user.email);
      
      // Stripe 체크아웃 페이지로 리디렉션
      window.location.href = url;
      
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('결제 페이지로 이동하는데 실패했습니다.');
      setLoading(false);
    }
  };

  // 고객 포털 열기
  const openCustomerPortal = async () => {
    if (!isAuthenticated || !user?.email) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    try {
      setLoading(true);
      
      const { url } = await createCustomerPortalSession(user.email);
      
      // 고객 포털 페이지로 리디렉션
      window.location.href = url;
      
    } catch (error) {
      console.error('Customer portal failed:', error);
      toast.error('구독 관리 페이지로 이동하는데 실패했습니다.');
      setLoading(false);
    }
  };

  // 사용자 로그인 시 구독 상태 자동 조회
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchSubscriptionStatus();
    }
  }, [isAuthenticated, user?.email]);

  return {
    loading,
    subscriptionData,
    startCheckout,
    openCustomerPortal,
    fetchSubscriptionStatus,
    isSubscribed: subscriptionData?.plan === 'PREMIUM',
    subscriptionStatus: subscriptionData?.status,
  };
}; 