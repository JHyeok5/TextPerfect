import { loadStripe } from '@stripe/stripe-js';

// Stripe 인스턴스 (싱글톤)
let stripePromise;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

// 결제 세션 생성
export const createCheckoutSession = async (planType, userId, userEmail) => {
  try {
    const response = await fetch('/.netlify/functions/stripe-create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planType,
        userId,
        userEmail,
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    return data.data;
  } catch (error) {
    console.error('Create checkout session error:', error);
    throw error;
  }
};

// 고객 포털 세션 생성
export const createCustomerPortalSession = async (userEmail) => {
  try {
    const response = await fetch('/.netlify/functions/stripe-customer-portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail,
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to create customer portal session');
    }

    return data.data;
  } catch (error) {
    console.error('Create customer portal session error:', error);
    throw error;
  }
};

// 구독 상태 조회
export const getSubscriptionStatus = async (userEmail) => {
  try {
    const response = await fetch(`/.netlify/functions/stripe-get-subscription?userEmail=${encodeURIComponent(userEmail)}`);
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to get subscription status');
    }

    return data.data;
  } catch (error) {
    console.error('Get subscription status error:', error);
    throw error;
  }
};

// 결제 성공 페이지에서 세션 확인
export const verifyCheckoutSession = async (sessionId) => {
  try {
    const response = await fetch(`/.netlify/functions/stripe-verify-session?session_id=${sessionId}`);
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to verify checkout session');
    }

    return data.data;
  } catch (error) {
    console.error('Verify checkout session error:', error);
    throw error;
  }
};

// 구독 취소
export const cancelSubscription = async (subscriptionId, cancelImmediately = false) => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('인증 토큰이 없습니다.');
    }

    const response = await fetch('/.netlify/functions/stripe-cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        subscriptionId,
        cancelImmediately,
      }),
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to cancel subscription');
    }

    return data;
  } catch (error) {
    console.error('Cancel subscription error:', error);
    throw error;
  }
};

// 플랜 정보
export const STRIPE_PLANS = {
  PREMIUM_MONTHLY: {
    id: 'PREMIUM_MONTHLY',
    name: '프리미엄 월간',
    price: 9900,
    interval: 'month',
    description: '월 9,900원으로 모든 프리미엄 기능 이용',
    features: [
      '월 100개 문서',
      '최대 10,000자',
      'AI 고급 분석',
      '모든 템플릿',
      'AI 코치 과정',
      '우선 지원'
    ]
  },
  PREMIUM_YEARLY: {
    id: 'PREMIUM_YEARLY',
    name: '프리미엄 연간',
    price: 99000,
    interval: 'year',
    description: '연 99,000원 (2개월 무료)',
    savings: '19,800원 절약',
    features: [
      '월 100개 문서',
      '최대 10,000자',
      'AI 고급 분석',
      '모든 템플릿',
      'AI 코치 과정',
      '우선 지원',
      '2개월 무료'
    ]
  }
}; 