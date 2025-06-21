import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS } from '../constants';
import { Header, Footer, Card, Button } from '../components/common';
import { useUser } from '../contexts/UserContext';
import { toast } from 'react-toastify';

export default function SubscriptionPage() {
  const plans = Object.values(SUBSCRIPTION_PLANS);
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (planName) => {
    if (planName === 'Free') {
      toast.info('이미 무료 플랜을 사용 중입니다.');
      return;
    }

    setLoading(true);
    try {
      // 임시 결제 처리 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 실제 구현에서는 여기서 결제 API 호출
      toast.info('🚧 결제 시스템은 현재 개발 중입니다.\n정식 서비스 오픈 시 이용 가능합니다.');
      
    } catch (error) {
      toast.error('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPlan = () => {
    return user?.subscription?.plan || 'FREE';
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Header 
        title="구독 플랜" 
        subtitle="TextPerfect의 다양한 구독 플랜을 확인하고 선택하세요." 
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card key={plan.name} className={`relative ${index === 1 ? 'border-2 border-blue-500' : ''}`}>
            {index === 1 && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  인기
                </span>
              </div>
            )}
            
            <div className="p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price === 0 ? '무료' : `₩${plan.price.toLocaleString()}`}
                </span>
                {plan.price > 0 && <span className="text-gray-500">/월</span>}
              </div>
              
              <ul className="space-y-3 mb-6 text-left">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              
              <div className="text-sm text-gray-600 mb-4 space-y-1">
                <div>월 문서 수: {plan.limit.monthlyDocs}개</div>
                <div>최대 텍스트 길이: {plan.limit.maxTextLength.toLocaleString()}자</div>
              </div>
              
              <Button 
                variant={index === 1 ? "primary" : "secondary"} 
                className="w-full"
                onClick={() => handleSubscribe(plan.name)}
                disabled={loading || (plan.name === 'Free' && getCurrentPlan() === 'FREE')}
              >
                {loading ? '처리 중...' : 
                 plan.price === 0 ? 
                   (getCurrentPlan() === 'FREE' ? '현재 플랜' : '무료 플랜으로 변경') : 
                   (getCurrentPlan() === plan.name.toUpperCase() ? '현재 플랜' : '구독하기')
                }
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Footer />
    </div>
  );
} 