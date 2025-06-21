const jwt = require('jsonwebtoken');
const { 
  createSuccessResponse, 
  createErrorResponse, 
  createCorsResponse,
  validateRequired,
  logDebug,
  logError 
} = require('./utils/response');
const { 
  saveToGitHub, 
  generateId, 
  extractTags 
} = require('./utils/github-storage');

exports.handler = async (event, context) => {
  // CORS 처리
  if (event.httpMethod === 'OPTIONS') {
    return createCorsResponse();
  }

  if (event.httpMethod !== 'POST') {
    return createErrorResponse('POST method required', 405);
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
    logDebug('Saving analysis for user:', userId);

    // 요청 데이터 검증
    const { 
      originalText, 
      optimizedText, 
      analysis, 
      purpose = 'general',
      options = {}
    } = JSON.parse(event.body);

    validateRequired(originalText, '원본 텍스트');
    validateRequired(optimizedText, '최적화된 텍스트');
    validateRequired(analysis, '분석 결과');

    // 히스토리 데이터 구성
    const historyId = generateId();
    const historyData = {
      id: historyId,
      userId,
      originalText,
      optimizedText,
      analysis,
      purpose,
      options,
      tags: extractTags(purpose, originalText),
      timestamp: new Date().toISOString(),
      textLength: originalText.length,
      improvementScore: analysis.readability || analysis.score || 0
    };

    // GitHub에 저장
    const filePath = `users/${userId}/history/${historyId}.json`;
    await saveToGitHub(filePath, historyData, `Save analysis ${historyId} for user ${userId}`);

    logDebug('Analysis saved successfully:', historyId);

    return createSuccessResponse({
      message: '분석 결과가 저장되었습니다.',
      historyId,
      timestamp: historyData.timestamp
    });

  } catch (error) {
    logError('Error in save-analysis:', error);
    return createErrorResponse(error.message, 500);
  }
}; 