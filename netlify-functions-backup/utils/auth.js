const { error } = require('./response');

// 환경변수 또는 설정에서 API 키 목록을 불러온다고 가정
const VALID_API_KEYS = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];
const RATE_LIMIT = 60; // 분당 60회
const rateLimitMap = new Map(); // { key: { count, last } }

function checkApiKey(event) {
  const key = event.headers['x-api-key'] || event.queryStringParameters?.apiKey;
  if (!key || !VALID_API_KEYS.includes(key)) {
    return error({ code: 'INVALID_API_KEY', message: '유효하지 않은 API 키입니다.', status: 401 });
  }
  return null;
}

function rateLimit(event) {
  const key = event.headers['x-api-key'] || event.queryStringParameters?.apiKey || event.headers['x-forwarded-for'] || 'anonymous';
  const now = Date.now();
  const windowMs = 60 * 1000;
  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, { count: 1, last: now });
    return null;
  }
  const info = rateLimitMap.get(key);
  if (now - info.last > windowMs) {
    rateLimitMap.set(key, { count: 1, last: now });
    return null;
  }
  if (info.count >= RATE_LIMIT) {
    return error({ code: 'RATE_LIMIT_EXCEEDED', message: '요청 제한을 초과했습니다.', status: 429 });
  }
  info.count++;
  rateLimitMap.set(key, info);
  return null;
}

function checkPermission(user, requiredRole = 'user') {
  if (!user || !user.role || user.role !== requiredRole) {
    return error({ code: 'FORBIDDEN', message: '권한이 없습니다.', status: 403 });
  }
  return null;
}

/**
 * 요청의 유효성을 검증하는 함수
 * @param {object} event Netlify Functions 이벤트 객체
 * @returns {object} 검증 결과 객체
 */
exports.validateRequest = (event) => {
  // 현재는 간단한 검증만 수행
  // TODO: 실제 인증/인가 로직 구현
  return {
    isValid: true,
    error: null
  };
};

module.exports = {
  checkApiKey,
  rateLimit,
  checkPermission,
  validateRequest,
}; 