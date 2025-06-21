/**
 * 간단한 회원가입 API (의존성 없음)
 * POST /.netlify/functions/auth-signup-simple
 */

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // POST 요청만 허용
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        code: 'METHOD_NOT_ALLOWED',
        message: 'POST 요청만 허용됩니다.',
        status: 405
      })
    };
  }

  try {
    // 요청 데이터 파싱
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          code: 'INVALID_JSON',
          message: '잘못된 JSON 형식입니다.',
          status: 400
        })
      };
    }

    const { nickname, email, password } = requestData;

    // 기본 검증
    if (!nickname || !email || !password) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          code: 'VALIDATION_ERROR',
          message: '닉네임, 이메일, 비밀번호를 모두 입력해주세요.',
          status: 400
        })
      };
    }

    // 간단한 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          code: 'INVALID_EMAIL',
          message: '올바른 이메일 형식이 아닙니다.',
          status: 400
        })
      };
    }

    // 환경 변수 확인
    const requiredEnvVars = ['GITHUB_TOKEN', 'JWT_SECRET'];
    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.error(`Missing environment variable: ${envVar}`);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({
            code: 'CONFIG_ERROR',
            message: '서버 설정 오류가 발생했습니다.',
            status: 500
          })
        };
      }
    }

    // 성공 응답 (실제 저장은 나중에 구현)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '회원가입 요청이 성공적으로 처리되었습니다.',
        data: {
          user: {
            nickname: nickname,
            email: email,
            id: 'temp_' + Date.now()
          },
          token: 'temp_token_' + Date.now()
        }
      })
    };

  } catch (err) {
    console.error('Signup error:', err);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        code: 'INTERNAL_ERROR',
        message: '서버 내부 오류가 발생했습니다.',
        status: 500
      })
    };
  }
}; 