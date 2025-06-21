// 디버그 로깅 함수
const logDebug = (...args) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('[DEBUG]', new Date().toISOString(), ...args);
  }
};

// 에러 로깅 함수
const logError = (...args) => {
  console.error('[ERROR]', new Date().toISOString(), ...args);
};

// 성공 응답 생성
const createSuccessResponse = (data, statusCode = 200) => {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: true,
      data,
      timestamp: new Date().toISOString()
    })
  };
};

// 에러 응답 생성
const createErrorResponse = (error, statusCode = 500) => {
  const errorMessage = typeof error === 'string' ? error : error.message || 'Internal server error';
  
  logError('Error response:', errorMessage, error);
  
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    })
  };
};

// CORS 헤더 응답
const createCorsResponse = () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Content-Type': 'application/json'
    },
    body: ''
  };
};

// 입력 검증 함수
const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    throw new Error(`${fieldName}은(는) 필수 항목입니다.`);
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('올바른 이메일 형식이 아닙니다.');
  }
};

const validateLength = (value, fieldName, min, max) => {
  if (value.length < min) {
    throw new Error(`${fieldName}은(는) 최소 ${min}자 이상이어야 합니다.`);
  }
  if (max && value.length > max) {
    throw new Error(`${fieldName}은(는) 최대 ${max}자 이하여야 합니다.`);
  }
};

module.exports = {
  logDebug,
  logError,
  createSuccessResponse,
  createErrorResponse,
  createCorsResponse,
  validateRequired,
  validateEmail,
  validateLength
}; 