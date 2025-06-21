/**
 * 회원가입 API
 * POST /.netlify/functions/auth/signup
 */

const { validateSignupData } = require('../utils/validation');
const { validatePasswordStrength, hashPassword } = require('../utils/password');
const { findUserByEmail, createUser } = require('../utils/github-storage');
const { generateToken } = require('../utils/jwt');
const { rateLimit } = require('../utils/auth');
const { success, error } = require('../utils/response');

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

    // 입력값 기본 검증
    const validation = validateSignupData(requestData);
    if (!validation.isValid) {
      return error({
        code: 'VALIDATION_ERROR',
        message: '입력값이 올바르지 않습니다.',
        details: validation.errors,
        status: 400
      }, headers);
    }

    const { nickname, email, password } = validation.sanitizedData;

    // 비밀번호 강도 검증
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      return error({
        code: 'WEAK_PASSWORD',
        message: '비밀번호가 보안 요구사항을 만족하지 않습니다.',
        details: passwordValidation.errors,
        status: 400
      }, headers);
    }

    // 이메일 중복 체크
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return error({
        code: 'EMAIL_EXISTS',
        message: '이미 사용 중인 이메일 주소입니다.',
        status: 409
      }, headers);
    }

    // 비밀번호 해싱
    const passwordHash = await hashPassword(password);

    // 새 사용자 생성
    const newUser = await createUser({
      nickname,
      email,
      passwordHash
    });

    // JWT 토큰 생성
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname
    });

    // 응답 데이터 (민감한 정보 제외)
    const userData = {
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
      level: newUser.level,
      exp: newUser.exp,
      subscription: newUser.subscription,
      createdAt: newUser.createdAt
    };

    return success({
      message: '회원가입이 완료되었습니다.',
      data: {
        user: userData,
        token: token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    }, headers);

  } catch (err) {
    console.error('Signup error:', err);
    
    // GitHub API 에러 처리
    if (err.message.includes('GitHub API Error')) {
      return error({
        code: 'STORAGE_ERROR',
        message: '사용자 데이터 저장 중 오류가 발생했습니다.',
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