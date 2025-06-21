/**
 * 간단한 회원가입 API (의존성 없음)
 * POST /.netlify/functions/auth-signup-simple
 */

exports.handler = async (event, context) => {
  console.log('🚀 AUTH-SIGNUP-SIMPLE FUNCTION CALLED!');
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
    console.log('✅ Processing POST request...');
    
    // 요청 데이터 파싱
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
      console.log('✅ Request data parsed:', Object.keys(requestData));
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          code: 'INVALID_JSON',
          message: '잘못된 JSON 형식입니다.',
          status: 400
        })
      };
    }

    const { nickname, email, password } = requestData;

    // 기본 검증
    if (!nickname || !email || !password) {
      console.log('❌ Validation failed: missing fields');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          code: 'VALIDATION_ERROR',
          message: '닉네임, 이메일, 비밀번호를 모두 입력해주세요.',
          status: 400
        })
      };
    }

    // 간단한 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Email validation failed');
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          code: 'INVALID_EMAIL',
          message: '올바른 이메일 형식이 아닙니다.',
          status: 400
        })
      };
    }

    console.log('✅ All validations passed, creating response...');

    // 성공 응답 (실제 저장은 나중에 구현)
    const response = {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '🎉 회원가입 요청이 성공적으로 처리되었습니다!',
        data: {
          user: {
            nickname: nickname,
            email: email,
            id: 'temp_' + Date.now()
          },
          token: 'temp_token_' + Date.now()
        },
        debug: {
          functionCalled: true,
          timestamp: new Date().toISOString()
        }
      })
    };

    console.log('✅ Sending success response');
    return response;

  } catch (err) {
    console.error('❌ Signup error:', err);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        code: 'INTERNAL_ERROR',
        message: '서버 내부 오류가 발생했습니다.',
        status: 500,
        debug: {
          error: err.message,
          timestamp: new Date().toISOString()
        }
      })
    };
  }
}; 