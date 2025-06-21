/**
 * 간단한 로그아웃 API (의존성 없음)
 * POST /.netlify/functions/auth-logout
 */

exports.handler = async (event, context) => {
  console.log('🚀 AUTH-LOGOUT FUNCTION CALLED!');
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
    // Authorization 헤더 확인 (선택적)
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      console.log('✅ Token received for logout:', token.substring(0, 20) + '...');
      
      // 실제 구현에서는 토큰을 블랙리스트에 추가
      // 현재는 임시로 성공 처리
    } else {
      console.log('ℹ️ No token provided - treating as already logged out');
    }

    console.log('✅ Logout successful');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '로그아웃되었습니다.',
        data: {},
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
    console.error('❌ Logout error:', error);
    
    // 로그아웃은 실패해도 성공으로 처리 (보안상 이유)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '로그아웃되었습니다.',
        data: {},
        debug: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      })
    };
  }
}; 