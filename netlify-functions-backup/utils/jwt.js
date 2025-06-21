/**
 * JWT 토큰 관리 유틸리티
 * 토큰 생성, 검증, 갱신 등의 기능 제공
 */

const jwt = require('jsonwebtoken');
const { isTokenBlacklisted } = require('./github-storage');

/**
 * JWT 토큰 생성
 */
function generateToken(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign(
    {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      iss: 'textperfect'
    },
    secret,
    { expiresIn }
  );
}

/**
 * JWT 토큰 검증
 */
async function verifyToken(token) {
  try {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    // 토큰이 블랙리스트에 있는지 확인
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new Error('Token has been revoked');
    }

    // JWT 검증
    const decoded = jwt.verify(token, secret);
    
    // 발급자 확인
    if (decoded.iss !== 'textperfect') {
      throw new Error('Invalid token issuer');
    }

    return {
      valid: true,
      payload: decoded,
      error: null
    };
  } catch (error) {
    return {
      valid: false,
      payload: null,
      error: error.message
    };
  }
}

/**
 * 토큰에서 사용자 ID 추출
 */
function getUserIdFromToken(token) {
  try {
    const decoded = jwt.decode(token);
    return decoded?.userId || null;
  } catch (error) {
    return null;
  }
}

/**
 * 토큰 만료 시간 확인
 */
function getTokenExpiration(token) {
  try {
    const decoded = jwt.decode(token);
    return decoded?.exp ? new Date(decoded.exp * 1000) : null;
  } catch (error) {
    return null;
  }
}

/**
 * 토큰이 곧 만료되는지 확인 (1시간 이내)
 */
function isTokenExpiringSoon(token) {
  const expiration = getTokenExpiration(token);
  if (!expiration) return false;
  
  const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
  return expiration < oneHourFromNow;
}

/**
 * 리프레시 토큰 생성 (더 긴 만료 시간)
 */
function generateRefreshToken(payload) {
  const secret = process.env.JWT_SECRET;
  
  return jwt.sign(
    {
      ...payload,
      type: 'refresh',
      iat: Math.floor(Date.now() / 1000),
      iss: 'textperfect'
    },
    secret,
    { expiresIn: '30d' }
  );
}

/**
 * Authorization 헤더에서 토큰 추출
 */
function extractTokenFromHeader(authHeader) {
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
}

/**
 * 요청에서 토큰 추출 및 검증
 */
async function authenticateRequest(event) {
  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = event.headers.authorization || event.headers.Authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return {
        authenticated: false,
        user: null,
        error: 'No token provided'
      };
    }

    // 토큰 검증
    const verification = await verifyToken(token);
    
    if (!verification.valid) {
      return {
        authenticated: false,
        user: null,
        error: verification.error
      };
    }

    return {
      authenticated: true,
      user: verification.payload,
      token: token,
      error: null
    };
  } catch (error) {
    return {
      authenticated: false,
      user: null,
      error: error.message
    };
  }
}

module.exports = {
  generateToken,
  verifyToken,
  getUserIdFromToken,
  getTokenExpiration,
  isTokenExpiringSoon,
  generateRefreshToken,
  extractTokenFromHeader,
  authenticateRequest
}; 