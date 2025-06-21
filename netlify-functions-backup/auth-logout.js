/**
 * 로그아웃 API
 * POST /.netlify/functions/auth/logout
 */

const { authenticateRequest } = require('./utils/jwt');
const { addToBlacklist } = require('./utils/github-storage');
const { success, error } = require('./utils/response');

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
    return error({
      code: 'METHOD_NOT_ALLOWED',
      message: 'POST 요청만 허용됩니다.',
      status: 405
    }, headers);
  }

  try {
    // 토큰 인증 (로그아웃이지만 유효한 토큰인지 확인)
    const authResult = await authenticateRequest(event);
    if (!authResult.authenticated) {
      // 이미 무효한 토큰이면 성공으로 처리 (이미 로그아웃된 상태)
      return success({
        message: '로그아웃되었습니다.',
        data: {}
      }, headers);
    }

    // 토큰을 블랙리스트에 추가
    await addToBlacklist(authResult.token);

    return success({
      message: '로그아웃되었습니다.',
      data: {}
    }, headers);

  } catch (err) {
    console.error('Logout error:', err);
    
    // GitHub API 에러 처리
    if (err.message.includes('GitHub API Error')) {
      return error({
        code: 'STORAGE_ERROR',
        message: '로그아웃 처리 중 오류가 발생했습니다.',
        status: 503
      }, headers);
    }

    // 로그아웃은 실패해도 성공으로 처리 (보안상 이유)
    return success({
      message: '로그아웃되었습니다.',
      data: {}
    }, headers);
  }
}; 