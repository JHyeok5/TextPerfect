/**
 * 로그인 API
 * POST /.netlify/functions/auth/login
 */

const { validateLoginData } = require('./utils/validation');
const { comparePassword } = require('./utils/password');
const { findUserByEmail, updateLastLogin, updateStats } = require('./utils/github-storage');
const { generateToken } = require('./utils/jwt');
const { rateLimit } = require('./utils/auth');
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
    // Rate limiting 체크
    const rateLimitResult = rateLimit(event);
    if (rateLimitResult) {
      return { ...rateLimitResult, headers };
    }

    // 요청 데이터 파싱
    let requestData;
    try {
      requestData = JSON.parse(event.body || '{}');
    } catch (parseError) {
      return error({
        code: 'INVALID_JSON',
        message: '잘못된 JSON 형식입니다.',
        status: 400
      }, headers);
    }

    // 입력값 검증
    const validation = validateLoginData(requestData);
    if (!validation.isValid) {
      return error({
        code: 'VALIDATION_ERROR',
        message: '입력값이 올바르지 않습니다.',
        details: validation.errors,
        status: 400
      }, headers);
    }

    const { email, password } = validation.sanitizedData;

    // 사용자 존재 확인
    const user = await findUserByEmail(email);
    if (!user) {
      return error({
        code: 'INVALID_CREDENTIALS',
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        status: 401
      }, headers);
    }

    // 계정 활성화 상태 확인
    if (!user.isActive) {
      return error({
        code: 'ACCOUNT_DISABLED',
        message: '비활성화된 계정입니다. 관리자에게 문의하세요.',
        status: 403
      }, headers);
    }

    // 비밀번호 검증
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return error({
        code: 'INVALID_CREDENTIALS',
        message: '이메일 또는 비밀번호가 올바르지 않습니다.',
        status: 401
      }, headers);
    }

    // 마지막 로그인 시간 업데이트
    const updatedUser = await updateLastLogin(user.id);

    // 로그인 통계 업데이트
    await updateStats('userLogin');

    // JWT 토큰 생성
    const token = generateToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      nickname: updatedUser.nickname
    });

    // 응답 데이터 (민감한 정보 제외)
    const userData = {
      id: updatedUser.id,
      email: updatedUser.email,
      nickname: updatedUser.nickname,
      level: updatedUser.level,
      exp: updatedUser.exp,
      subscription: updatedUser.subscription,
      createdAt: updatedUser.createdAt,
      lastLoginAt: updatedUser.lastLoginAt
    };

    return success({
      message: '로그인되었습니다.',
      data: {
        user: userData,
        token: token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    }, headers);

  } catch (err) {
    console.error('Login error:', err);
    
    // GitHub API 에러 처리
    if (err.message.includes('GitHub API Error')) {
      return error({
        code: 'STORAGE_ERROR',
        message: '사용자 데이터 조회 중 오류가 발생했습니다.',
        status: 503
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