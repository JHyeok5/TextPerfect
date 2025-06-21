const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const { 
  createSuccessResponse, 
  createErrorResponse, 
  createCorsResponse,
  logDebug,
  logError 
} = require('./utils/response');

// JWT 토큰 검증
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

exports.handler = async (event, context) => {
  // CORS 처리
  if (event.httpMethod === 'OPTIONS') {
    return createCorsResponse();
  }

  if (event.httpMethod !== 'POST') {
    return createErrorResponse('POST method required', 405);
  }

  try {
    // JWT 토큰 검증
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse('인증 토큰이 필요합니다.', 401);
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return createErrorResponse('유효하지 않은 토큰입니다.', 401);
    }

    logDebug('Processing subscription cancellation for user:', decoded.userId);

    // 요청 데이터 파싱
    const { subscriptionId, cancelImmediately = false } = JSON.parse(event.body);

    if (!subscriptionId) {
      return createErrorResponse('구독 ID가 필요합니다.', 400);
    }

    // 구독 정보 조회
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    
    if (!subscription) {
      return createErrorResponse('구독을 찾을 수 없습니다.', 404);
    }

    // 구독 취소 처리
    let canceledSubscription;
    
    if (cancelImmediately) {
      // 즉시 취소
      canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);
      logDebug('Subscription canceled immediately:', subscriptionId);
    } else {
      // 현재 결제 기간 종료 시 취소
      canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });
      logDebug('Subscription set to cancel at period end:', subscriptionId);
    }

    // 고객 정보 조회
    const customer = await stripe.customers.retrieve(subscription.customer);

    return createSuccessResponse({
      message: cancelImmediately 
        ? '구독이 즉시 취소되었습니다.' 
        : '구독이 현재 결제 기간 종료 시 취소됩니다.',
      subscription: {
        id: canceledSubscription.id,
        status: canceledSubscription.status,
        cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
        currentPeriodEnd: canceledSubscription.current_period_end,
        canceledAt: canceledSubscription.canceled_at,
        endedAt: canceledSubscription.ended_at
      },
      customer: {
        id: customer.id,
        email: customer.email
      }
    });

  } catch (error) {
    logError('Error in stripe-cancel-subscription:', error);
    
    if (error.type === 'StripeCardError') {
      return createErrorResponse(`카드 오류: ${error.message}`, 400);
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return createErrorResponse(`잘못된 요청: ${error.message}`, 400);
    }
    
    if (error.type === 'StripeAPIError') {
      return createErrorResponse('결제 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.', 503);
    }
    
    return createErrorResponse('구독 취소 중 오류가 발생했습니다.', 500);
  }
}; 