/**
 * 간단한 로그인 API (의존성 없음)
 * POST /.netlify/functions/auth-login
 */

exports.handler = async (event, context) => {
  console.log('🚀 AUTH-LOGIN FUNCTION CALLED!');
  console.log('Function called:', {
    method: event.httpMethod,
    path: event.path,
    body: event.body ? 'Body present' : 'No body',
    timestamp: new Date().toISOString()
  });

  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    console.log('✅ OPTIONS request handled');
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // POST 요청만 허용
  if (event.httpMethod !== 'POST') {
    console.log('❌ Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        code: 'METHOD_NOT_ALLOWED',
        message: 'POST 요청만 허용됩니다.',
        status: 405,
        debug: {
          receivedMethod: event.httpMethod,
          timestamp: new Date().toISOString()
        }
      })
    };
  }

  try {
    // 요청 데이터 파싱
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
      console.log('📝 Request data received:', { email: requestData.email, hasPassword: !!requestData.password });
    } catch (parseError) {
      console.log('❌ JSON parsing error:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          code: 'INVALID_JSON',
          message: '잘못된 JSON 형식입니다.',
          status: 400,
          debug: {
            error: parseError.message,
            timestamp: new Date().toISOString()
          }
        })
      };
    }

    const { email, password } = requestData;

    // 기본 검증
    if (!email || !password) {
      console.log('❌ Missing required fields');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          code: 'MISSING_FIELDS',
          message: '이메일과 비밀번호는 필수입니다.',
          status: 400,
          debug: {
            hasEmail: !!email,
            hasPassword: !!password,
            timestamp: new Date().toISOString()
          }
        })
      };
    }

    // 임시 로그인 처리 (실제 구현 전까지)
    console.log('✅ Login attempt for:', email);
    
    // 사용자 데이터 (실제 로그인 정보 반영)
    const userData = {
      id: 'temp-user-id',
      email: email,
      nickname: email.split('@')[0],
      level: 1,
      exp: 0,
      subscription: {
        plan: 'FREE',
        usage: {
          monthlyDocs: 0,
          maxTextLength: 1000
        }
      },
      stats: {
        optimizedDocs: 0,
        improvedSentences: 0,
        avgImprovement: 0,
        consecutiveDays: 0
      },
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    // 임시 토큰 (실제 이메일 정보 포함)
    const token = 'temp-jwt-token-' + btoa(email) + '-' + Date.now();

    console.log('✅ Login successful for:', email);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '로그인되었습니다.',
        data: {
          user: userData,
          token: token,
          expiresIn: '7d'
        },
        debug: {
          timestamp: new Date().toISOString(),
          environment: {
            NODE_ENV: process.env.NODE_ENV,
            hasGithubToken: !!process.env.GITHUB_TOKEN,
            hasJwtSecret: !!process.env.JWT_SECRET
          }
        }
      })
    };

  } catch (error) {
    console.error('❌ Login error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        code: 'INTERNAL_ERROR',
        message: '서버 내부 오류가 발생했습니다.',
        status: 500,
        debug: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      })
    };
  }
}; 