const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const { 
  createSuccessResponse, 
  createErrorResponse, 
  createCorsResponse,
  validateRequired,
  logDebug,
  logError 
} = require('./utils/response');
const { saveToGitHub, getFromGitHub } = require('./utils/github-storage');

// Google OAuth 클라이언트 초기화
const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// 사용자 조회 또는 생성
const findOrCreateUser = async (profile) => {
  try {
    const { email, name, picture, sub } = profile;
    
    // 기존 사용자 조회 (이메일 기준)
    let existingUser = null;
    try {
      existingUser = await getFromGitHub(`users/by-email/${Buffer.from(email).toString('base64')}.json`);
    } catch (error) {
      // 사용자가 없으면 새로 생성
    }

    if (existingUser) {
      // 기존 사용자가 있으면 Google 연동 정보 업데이트
      const updatedUser = {
        ...existingUser,
        googleId: sub,
        avatar: picture,
        lastLoginAt: new Date().toISOString(),
        providers: existingUser.providers ? [...new Set([...existingUser.providers, 'google'])] : ['google']
      };

      // 사용자 정보 업데이트
      await saveToGitHub(`users/${existingUser.id}/profile.json`, updatedUser, `Update user ${existingUser.id} with Google OAuth`);
      await saveToGitHub(`users/by-email/${Buffer.from(email).toString('base64')}.json`, updatedUser, `Update user email mapping for ${email}`);

      return updatedUser;
    } else {
      // 새 사용자 생성
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newUser = {
        id: userId,
        email,
        nickname: name,
        avatar: picture,
        googleId: sub,
        providers: ['google'],
        level: 1,
        exp: 0,
        subscription: {
          plan: 'FREE',
          status: 'active',
          usage: {
            monthlyDocs: 0,
            maxTextLength: 1000,
            dailyUsage: 0,
            lastResetDate: new Date().toISOString().split('T')[0]
          }
        },
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      };

      // 사용자 정보 저장
      await saveToGitHub(`users/${userId}/profile.json`, newUser, `Create new user ${userId} via Google OAuth`);
      await saveToGitHub(`users/by-email/${Buffer.from(email).toString('base64')}.json`, newUser, `Create email mapping for ${email}`);

      return newUser;
    }
  } catch (error) {
    logError('Error in findOrCreateUser:', error);
    throw new Error('사용자 정보 처리 중 오류가 발생했습니다.');
  }
};

// JWT 토큰 생성
const generateJWT = (user) => {
  const payload = {
    userId: user.id,
    email: user.email,
    nickname: user.nickname,
    plan: user.subscription?.plan || 'FREE'
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.handler = async (event, context) => {
  // CORS 처리
  if (event.httpMethod === 'OPTIONS') {
    return createCorsResponse();
  }

  if (event.httpMethod !== 'POST') {
    return createErrorResponse('POST method required', 405);
  }

  try {
    // 환경 변수 확인
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      logError('Google OAuth credentials not configured');
      return createErrorResponse('Google OAuth가 설정되지 않았습니다.', 500);
    }

    // 요청 데이터 파싱
    const { code, state } = JSON.parse(event.body);
    
    validateRequired(code, '인증 코드');
    logDebug('Processing Google OAuth callback with code:', code.substring(0, 10) + '...');

    // Google에서 토큰 교환
    const { tokens } = await client.getToken(code);
    
    // ID 토큰 검증
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    logDebug('Google OAuth payload received for:', payload.email);

    // 사용자 조회 또는 생성
    const user = await findOrCreateUser(payload);

    // JWT 토큰 생성
    const token = generateJWT(user);

    logDebug('Google OAuth login successful for user:', user.id);

    return createSuccessResponse({
      message: 'Google 로그인이 완료되었습니다.',
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        avatar: user.avatar,
        level: user.level,
        exp: user.exp,
        subscription: user.subscription,
        providers: user.providers
      },
      token,
      expiresIn: '7d'
    });

  } catch (error) {
    logError('Error in Google OAuth handler:', error);
    
    if (error.message.includes('invalid_grant')) {
      return createErrorResponse('인증 코드가 만료되었습니다. 다시 시도해주세요.', 400);
    }
    
    if (error.message.includes('redirect_uri_mismatch')) {
      return createErrorResponse('리다이렉트 URI가 일치하지 않습니다.', 400);
    }
    
    return createErrorResponse(error.message, 500);
  }
}; 