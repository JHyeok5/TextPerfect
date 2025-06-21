// 표준 응답 포맷 및 CORS 헤더 유틸

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
};

function withCorsHeaders(body, statusCode = 200, extraHeaders = {}) {
  return {
    statusCode,
    headers: { ...CORS_HEADERS, ...extraHeaders },
    body: JSON.stringify(body),
  };
}

function success(data = {}, message = '성공', statusCode = 200) {
  return withCorsHeaders({ success: true, data, message, error: null }, statusCode);
}

function error({ code = 'UNKNOWN_ERROR', message = '알 수 없는 오류', status = 400, detail = null }) {
  return withCorsHeaders({ success: false, data: null, message, error: { code, message, detail } }, status);
}

/**
 * 표준화된 응답을 생성하는 함수
 * @param {number} statusCode HTTP 상태 코드
 * @param {object} body 응답 본문
 * @returns {object} Netlify Functions 응답 객체
 */
exports.createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  };
};

module.exports = {
  success,
  error,
  withCorsHeaders,
  CORS_HEADERS,
  createResponse,
}; 