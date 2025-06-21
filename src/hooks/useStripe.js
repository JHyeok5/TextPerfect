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

  // ���� ���� ��ȸ
  const fetchSubscriptionStatus = async () => {
    if (!isAuthenticated || !user?.email) return;

    try {
      setLoading(true);
      const data = await getSubscriptionStatus(user.email);
      setSubscriptionData(data);
    } catch (error) {
      console.error('Failed to fetch subscription status:', error);
      toast.error('���� ���¸� ��ȸ�ϴµ� �����߽��ϴ�.');
    } finally {
      setLoading(false);
    }
  };

  // ���� ����
  const startCheckout = async (planType) => {
    if (!isAuthenticated) {
      toast.error('�α����� �ʿ��մϴ�.');
      return;
    }

    if (!user?.id || !user?.email) {
      toast.error('����� ������ �����ϴ�.');
      return;
    }

    try {
      setLoading(true);
      
      // üũ�ƿ� ���� ����
      const { url } = await createCheckoutSession(planType, user.id, user.email);
      
      // Stripe üũ�ƿ� �������� ���𷺼�
      window.location.href = url;
      
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('���� �������� �̵��ϴµ� �����߽��ϴ�.');
      setLoading(false);
    }
  };

  // �� ���� ����
  const openCustomerPortal = async () => {
    if (!isAuthenticated || !user?.email) {
      toast.error('�α����� �ʿ��մϴ�.');
      return;
    }

    try {
      setLoading(true);
      
      const { url } = await createCustomerPortalSession(user.email);
      
      // �� ���� �������� ���𷺼�
      window.location.href = url;
      
    } catch (error) {
      console.error('Customer portal failed:', error);
      toast.error('���� ���� �������� �̵��ϴµ� �����߽��ϴ�.');
      setLoading(false);
    }
  };

  // ����� �α��� �� ���� ���� �ڵ� ��ȸ
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
