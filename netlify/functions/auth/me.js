/**
 * 현재 사용자 정보 조회 API
 * GET /.netlify/functions/auth/me
 */

const { authenticateRequest } = require('../utils/jwt');
const { findUserById } = require('../utils/github-storage');
const { success, error } = require('../utils/response');

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // GET 요청만 허용
  if (event.httpMethod !== 'GET') {
    return error({
      code: 'METHOD_NOT_ALLOWED',
      message: 'GET 요청만 허용됩니다.',
      status: 405
    }, headers);
  }

  try {
    // 토큰 인증
    const authResult = await authenticateRequest(event);
    if (!authResult.authenticated) {
      return error({
        code: 'UNAUTHORIZED',
        message: authResult.error || '인증이 필요합니다.',
        status: 401
      }, headers);
    }

    // 사용자 정보 조회
    const user = await findUserById(authResult.user.userId);
    if (!user) {
      return error({
        code: 'USER_NOT_FOUND',
        message: '사용자를 찾을 수 없습니다.',
        status: 404
      }, headers);
    }

    // 계정 활성화 상태 확인
    if (!user.isActive) {
      return error({
        code: 'ACCOUNT_DISABLED',
        message: '비활성화된 계정입니다.',
        status: 403
      }, headers);
    }

    // 응답 데이터 (민감한 정보 제외)
    const userData = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      level: user.level,
      exp: user.exp,
      subscription: user.subscription,
      createdAt: user.createdAt,
      lastLoginAt: user.lastLoginAt,
      updatedAt: user.updatedAt
    };

    return success({
      message: '사용자 정보를 조회했습니다.',
      data: {
        user: userData
      }
    }, headers);

  } catch (err) {
    console.error('Get user info error:', err);
    
    // GitHub API 에러 처리
    if (err.message.includes('GitHub API Error')) {
      return error({
        code: 'STORAGE_ERROR',
        message: '사용자 데이터 조회 중 오류가 발생했습니다.',
        status: 503
      }, headers);
    }

    // JWT 관련 에러
    if (err.message.includes('jwt') || err.message.includes('token')) {
      return error({
        code: 'TOKEN_ERROR',
        message: '토큰 처리 중 오류가 발생했습니다.',
        status: 401
      }, headers);
    }

    // 일반적인 서버 에러
    return error({
      code: 'INTERNAL_ERROR',
      message: '서버 내부 오류가 발생했습니다.',
      status: 500
    }, headers);
  }
}; 