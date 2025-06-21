const axios = require('axios');
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

// 사용자 조회 또는 생성
const findOrCreateUser = async (githubUser) => {
  try {
    const { email, login, avatar_url, id } = githubUser;
    
    // 이메일이 없는 경우 GitHub API에서 이메일 조회
    let userEmail = email;
    if (!userEmail) {
      logDebug('Email not provided, using GitHub username as fallback');
      userEmail = `${login}@github.local`; // 임시 이메일
    }
    
    // 기존 사용자 조회 (이메일 기준)
    let existingUser = null;
    try {
      existingUser = await getFromGitHub(`users/by-email/${Buffer.from(userEmail).toString('base64')}.json`);
    } catch (error) {
      // 사용자가 없으면 새로 생성
    }

    if (existingUser) {
      // 기존 사용자가 있으면 GitHub 연동 정보 업데이트
      const updatedUser = {
        ...existingUser,
        githubId: id.toString(),
        avatar: avatar_url,
        lastLoginAt: new Date().toISOString(),
        providers: existingUser.providers ? [...new Set([...existingUser.providers, 'github'])] : ['github']
      };

      // 사용자 정보 업데이트
      await saveToGitHub(`users/${existingUser.id}/profile.json`, updatedUser, `Update user ${existingUser.id} with GitHub OAuth`);
      await saveToGitHub(`users/by-email/${Buffer.from(userEmail).toString('base64')}.json`, updatedUser, `Update user email mapping for ${userEmail}`);

      return updatedUser;
    } else {
      // 새 사용자 생성
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newUser = {
        id: userId,
        email: userEmail,
        nickname: login,
        avatar: avatar_url,
        githubId: id.toString(),
        providers: ['github'],
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
      await saveToGitHub(`users/${userId}/profile.json`, newUser, `Create new user ${userId} via GitHub OAuth`);
      await saveToGitHub(`users/by-email/${Buffer.from(userEmail).toString('base64')}.json`, newUser, `Create email mapping for ${userEmail}`);

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
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      logError('GitHub OAuth credentials not configured');
      return createErrorResponse('GitHub OAuth가 설정되지 않았습니다.', 500);
    }

    // 요청 데이터 파싱
    const { code } = JSON.parse(event.body);
    
    validateRequired(code, '인증 코드');
    logDebug('Processing GitHub OAuth callback with code:', code.substring(0, 10) + '...');

    // GitHub에서 액세스 토큰 교환
    const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    }, {
      headers: {
        'Accept': 'application/json'
      }
    });

    const { access_token, error, error_description } = tokenResponse.data;

    if (error) {
      logError('GitHub OAuth token exchange error:', error, error_description);
      return createErrorResponse(`GitHub 인증 오류: ${error_description || error}`, 400);
    }

    if (!access_token) {
      return createErrorResponse('GitHub에서 액세스 토큰을 받지 못했습니다.', 400);
    }

    // 사용자 정보 조회
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { 
        'Authorization': `token ${access_token}`,
        'User-Agent': 'TextPerfect-App'
      }
    });

    const githubUser = userResponse.data;
    logDebug('GitHub OAuth user data received for:', githubUser.login);

    // 사용자 조회 또는 생성
    const user = await findOrCreateUser(githubUser);

    // JWT 토큰 생성
    const token = generateJWT(user);

    logDebug('GitHub OAuth login successful for user:', user.id);

    return createSuccessResponse({
      message: 'GitHub 로그인이 완료되었습니다.',
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
    logError('Error in GitHub OAuth handler:', error);
    
    if (error.response?.status === 401) {
      return createErrorResponse('GitHub 인증에 실패했습니다. 다시 시도해주세요.', 401);
    }
    
    if (error.code === 'ENOTFOUND') {
      return createErrorResponse('네트워크 연결을 확인해주세요.', 500);
    }
    
    return createErrorResponse(error.message, 500);
  }
}; 