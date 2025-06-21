const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createSuccessResponse, createErrorResponse, logDebug, logError } = require('./utils/response');

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // OPTIONS 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return createErrorResponse('Method not allowed', 405, headers);
  }

  try {
    const { userEmail } = JSON.parse(event.body);
    
    if (!userEmail) {
      return createErrorResponse('User email is required', 400, headers);
    }

    logDebug('Creating customer portal session for:', userEmail);

    // 고객 찾기
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    });

    if (customers.data.length === 0) {
      return createErrorResponse('Customer not found', 404, headers);
    }

    const customer = customers.data[0];

    // 고객 포털 세션 생성
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.URL || 'http://localhost:3000'}/subscription`,
    });

    logDebug('Customer portal session created:', portalSession.id);

    return createSuccessResponse({
      url: portalSession.url
    }, headers);

  } catch (error) {
    logError('Customer portal creation failed:', error);
    return createErrorResponse(
      'Failed to create customer portal session',
      500,
      headers
    );
  }
}; 