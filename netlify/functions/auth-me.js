/**
 * 간단한 사용자 정보 조회 API (의존성 없음)
 * GET /.netlify/functions/auth-me
 */

exports.handler = async (event, context) => {
  console.log('🚀 AUTH-ME FUNCTION CALLED!');
  console.log('Function called:', {
    method: event.httpMethod,
    path: event.path,
    hasAuth: !!event.headers.authorization,
    timestamp: new Date().toISOString()
  });

  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  // GET 요청만 허용
  if (event.httpMethod !== 'GET') {
    console.log('❌ Method not allowed:', event.httpMethod);
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        code: 'METHOD_NOT_ALLOWED',
        message: 'GET 요청만 허용됩니다.',
        status: 405,
        debug: {
          receivedMethod: event.httpMethod,
          timestamp: new Date().toISOString()
        }
      })
    };
  }

  try {
    // Authorization 헤더 확인
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    if (!authHeader) {
      console.log('❌ No authorization header');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          code: 'UNAUTHORIZED',
          message: '인증이 필요합니다.',
          status: 401,
          debug: {
            timestamp: new Date().toISOString()
          }
        })
      };
    }

    // Bearer 토큰 추출
    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token provided');
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          success: false,
          code: 'INVALID_TOKEN',
          message: '유효하지 않은 토큰입니다.',
          status: 401,
          debug: {
            timestamp: new Date().toISOString()
          }
        })
      };
    }

    console.log('✅ Token received:', token.substring(0, 20) + '...');

    // 토큰에서 사용자 정보 추출 (임시로 토큰에서 이메일 추출)
    // 실제로는 JWT 디코딩이나 DB 조회를 해야 함
    let userEmail = 'user@example.com';
    let userNickname = 'User';
    
    // 토큰에서 기본 정보 추출 시도 (간단한 방법)
    try {
      if (token.includes('temp-jwt-token-')) {
        // 로그인 시 생성한 임시 토큰에서 정보 추출
        const tokenParts = token.split('-');
        if (tokenParts.length >= 3) {
          try {
            userEmail = atob(tokenParts[1]); // base64 디코딩
            userNickname = userEmail.split('@')[0];
            console.log('✅ Extracted email from token:', userEmail);
          } catch (decodeError) {
            console.log('Failed to decode email from token');
          }
        }
      }
    } catch (e) {
      console.log('Token parsing failed, using defaults');
    }

    // 사용자 데이터 (실제 사용자 정보 반영)
    const userData = {
      id: 'temp-user-id',
      email: userEmail,
      nickname: userNickname,
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
      lastLoginAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('✅ User info retrieved');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '사용자 정보를 조회했습니다.',
        data: {
          user: userData
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
    console.error('❌ Get user info error:', error);
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