const jwt = require('jsonwebtoken');
const { 
  createSuccessResponse, 
  createErrorResponse, 
  createCorsResponse,
  validateRequired,
  logDebug,
  logError 
} = require('./utils/response');
const { getFromGitHub } = require('./utils/github-storage');

exports.handler = async (event, context) => {
  // CORS 처리
  if (event.httpMethod === 'OPTIONS') {
    return createCorsResponse();
  }

  if (event.httpMethod !== 'GET') {
    return createErrorResponse('GET method required', 405);
  }

  try {
    // JWT 토큰 검증
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createErrorResponse('인증 토큰이 필요합니다.', 401);
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return createErrorResponse('유효하지 않은 토큰입니다.', 401);
    }

    const userId = decoded.userId;
    
    // 히스토리 ID 파라미터 검증
    const params = event.queryStringParameters || {};
    const historyId = params.id;
    
    validateRequired(historyId, '히스토리 ID');
    logDebug('Getting history detail for user:', userId, 'historyId:', historyId);

    // GitHub에서 히스토리 데이터 조회
    const filePath = `users/${userId}/history/${historyId}.json`;
    const historyData = await getFromGitHub(filePath);

    if (!historyData) {
      return createErrorResponse('히스토리를 찾을 수 없습니다.', 404);
    }

    // 사용자 권한 확인
    if (historyData.userId !== userId) {
      return createErrorResponse('접근 권한이 없습니다.', 403);
    }

    logDebug('History detail retrieved successfully:', historyId);

    return createSuccessResponse({
      history: historyData
    });

  } catch (error) {
    logError('Error in get-history-detail:', error);
    
    if (error.message.includes('찾을 수 없습니다')) {
      return createErrorResponse('히스토리를 찾을 수 없습니다.', 404);
    }
    
    return createErrorResponse(error.message, 500);
  }
}; 