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
    const { planType, userId, userEmail } = JSON.parse(event.body);
    
    logDebug('Creating checkout session for:', { planType, userId, userEmail });

    // 플랜별 가격 ID 매핑 (실제 Stripe에서 생성한 Price ID로 교체 필요)
    const priceIds = {
      'PREMIUM_MONTHLY': 'price_premium_monthly_test', // 실제 Price ID로 교체
      'PREMIUM_YEARLY': 'price_premium_yearly_test',   // 실제 Price ID로 교체
    };

    const priceId = priceIds[planType];
    if (!priceId) {
      return createErrorResponse('Invalid plan type', 400, headers);
    }

    // Stripe 고객 찾기 또는 생성
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: userEmail,
        limit: 1
      });
      
      if (customers.data.length > 0) {
        customer = customers.data[0];
        logDebug('Found existing customer:', customer.id);
      } else {
        customer = await stripe.customers.create({
          email: userEmail,
          metadata: {
            userId: userId
          }
        });
        logDebug('Created new customer:', customer.id);
      }
    } catch (error) {
      logError('Customer creation/lookup failed:', error);
      return createErrorResponse('Customer creation failed', 500, headers);
    }

    // 결제 세션 생성
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.URL || 'http://localhost:3000'}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL || 'http://localhost:3000'}/subscription?canceled=true`,
      client_reference_id: userId,
      metadata: {
        userId: userId,
        planType: planType
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      subscription_data: {
        metadata: {
          userId: userId,
          planType: planType
        }
      }
    });

    logDebug('Checkout session created:', session.id);

    return createSuccessResponse({
      sessionId: session.id,
      url: session.url
    }, headers);

  } catch (error) {
    logError('Stripe checkout creation failed:', error);
    return createErrorResponse(
      'Failed to create checkout session',
      500,
      headers
    );
  }
}; 