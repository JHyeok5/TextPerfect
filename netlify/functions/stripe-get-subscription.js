const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createSuccessResponse, createErrorResponse, logDebug, logError } = require('./utils/response');

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // OPTIONS 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return createErrorResponse('Method not allowed', 405, headers);
  }

  try {
    const { userEmail } = event.queryStringParameters || {};
    
    if (!userEmail) {
      return createErrorResponse('User email is required', 400, headers);
    }

    logDebug('Getting subscription for user:', userEmail);

    // 고객 찾기
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (customers.data.length === 0) {
      // 고객이 없으면 무료 플랜
      return createSuccessResponse({
        plan: 'FREE',
        status: 'no_subscription',
        subscription: null
      }, headers);
    }

    const customer = customers.data[0];

    // 활성 구독 찾기
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      // 구독이 없으면 무료 플랜
      return createSuccessResponse({
        plan: 'FREE',
        status: 'no_subscription',
        subscription: null
      }, headers);
    }

    const subscription = subscriptions.data[0];
    
    // 구독 상태에 따른 플랜 결정
    let plan = 'FREE';
    if (subscription.status === 'active' || subscription.status === 'trialing') {
      plan = 'PREMIUM';
    }

    const subscriptionData = {
      plan: plan,
      status: subscription.status,
      subscription: {
        id: subscription.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
      }
    };

    logDebug('Subscription data retrieved:', subscriptionData);

    return createSuccessResponse(subscriptionData, headers);

  } catch (error) {
    logError('Get subscription failed:', error);
    return createErrorResponse(
      'Failed to get subscription',
      500,
      headers
    );
  }
}; 