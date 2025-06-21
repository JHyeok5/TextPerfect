const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createSuccessResponse, createErrorResponse, logDebug, logError } = require('./utils/response');

// GitHub Storage 유틸리티 (간단한 버전)
async function updateUserSubscription(userId, subscriptionData) {
  try {
    // 실제 구현에서는 GitHub Storage API 또는 데이터베이스 연동
    logDebug('Updating user subscription:', { userId, subscriptionData });
    
    // 임시로 로컬 스토리지 업데이트 로직
    // 실제로는 서버 사이드 데이터베이스 업데이트
    return true;
  } catch (error) {
    logError('Failed to update user subscription:', error);
    return false;
  }
}

exports.handler = async (event, context) => {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let stripeEvent;

  try {
    // Stripe 웹훅 서명 검증
    stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
    logDebug('Webhook signature verified:', stripeEvent.type);
  } catch (err) {
    logError('Webhook signature verification failed:', err.message);
    return createErrorResponse(`Webhook Error: ${err.message}`, 400);
  }

  // 이벤트 타입별 처리
  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object);
        break;
        
      case 'customer.subscription.created':
        await handleSubscriptionCreated(stripeEvent.data.object);
        break;
        
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object);
        break;
        
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object);
        break;
        
      default:
        logDebug('Unhandled event type:', stripeEvent.type);
    }

    return createSuccessResponse({ received: true });
    
  } catch (error) {
    logError('Webhook processing failed:', error);
    return createErrorResponse('Webhook processing failed', 500);
  }
};

// 결제 완료 처리
async function handleCheckoutCompleted(session) {
  logDebug('Checkout completed:', session.id);
  
  const userId = session.client_reference_id || session.metadata?.userId;
  const planType = session.metadata?.planType;
  
  if (!userId) {
    logError('No user ID found in checkout session');
    return;
  }

  // 구독 정보 조회
  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  
  const subscriptionData = {
    stripeCustomerId: session.customer,
    stripeSubscriptionId: subscription.id,
    plan: planType || 'PREMIUM',
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    updatedAt: new Date().toISOString()
  };

  await updateUserSubscription(userId, subscriptionData);
  logDebug('User subscription updated after checkout:', userId);
}

// 구독 생성 처리
async function handleSubscriptionCreated(subscription) {
  logDebug('Subscription created:', subscription.id);
  
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userId = customer.metadata?.userId;
  
  if (!userId) {
    logError('No user ID found in customer metadata');
    return;
  }

  const subscriptionData = {
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: subscription.id,
    plan: 'PREMIUM',
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    updatedAt: new Date().toISOString()
  };

  await updateUserSubscription(userId, subscriptionData);
}

// 구독 업데이트 처리
async function handleSubscriptionUpdated(subscription) {
  logDebug('Subscription updated:', subscription.id);
  
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userId = customer.metadata?.userId;
  
  if (!userId) {
    logError('No user ID found in customer metadata');
    return;
  }

  const subscriptionData = {
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: subscription.id,
    plan: subscription.status === 'active' ? 'PREMIUM' : 'FREE',
    status: subscription.status,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    updatedAt: new Date().toISOString()
  };

  await updateUserSubscription(userId, subscriptionData);
}

// 구독 취소 처리
async function handleSubscriptionDeleted(subscription) {
  logDebug('Subscription deleted:', subscription.id);
  
  const customer = await stripe.customers.retrieve(subscription.customer);
  const userId = customer.metadata?.userId;
  
  if (!userId) {
    logError('No user ID found in customer metadata');
    return;
  }

  const subscriptionData = {
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: null,
    plan: 'FREE',
    status: 'canceled',
    currentPeriodStart: null,
    currentPeriodEnd: null,
    updatedAt: new Date().toISOString()
  };

  await updateUserSubscription(userId, subscriptionData);
}

// 결제 성공 처리
async function handlePaymentSucceeded(invoice) {
  logDebug('Payment succeeded for invoice:', invoice.id);
  
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
    await handleSubscriptionUpdated(subscription);
  }
}

// 결제 실패 처리
async function handlePaymentFailed(invoice) {
  logError('Payment failed for invoice:', invoice.id);
  
  // 결제 실패 시 사용자에게 알림 등 추가 처리
  // 이메일 발송, 앱 내 알림 등
} 