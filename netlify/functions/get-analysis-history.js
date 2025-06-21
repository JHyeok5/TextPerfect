const jwt = require('jsonwebtoken');
const { 
  createSuccessResponse, 
  createErrorResponse, 
  createCorsResponse,
  logDebug,
  logError 
} = require('./utils/response');
const { getUserHistory } = require('./utils/github-storage');

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
    logDebug('Getting analysis history for user:', userId);

    // 쿼리 파라미터 파싱
    const params = event.queryStringParameters || {};
    const page = parseInt(params.page) || 1;
    const limit = Math.min(parseInt(params.limit) || 10, 50); // 최대 50개
    const search = params.search || '';
    const tags = params.tags ? params.tags.split(',').filter(Boolean) : [];

    logDebug('Query parameters:', { page, limit, search, tags });

    // 히스토리 조회
    const result = await getUserHistory(userId, {
      page,
      limit,
      search,
      tags
    });

    // 민감한 정보 제거 (필요시)
    const sanitizedData = result.data.map(item => ({
      id: item.id,
      originalText: item.originalText.substring(0, 200) + (item.originalText.length > 200 ? '...' : ''),
      optimizedText: item.optimizedText.substring(0, 200) + (item.optimizedText.length > 200 ? '...' : ''),
      analysis: {
        readability: item.analysis.readability,
        clarity: item.analysis.clarity,
        professionalism: item.analysis.professionalism,
        improvements: item.analysis.improvements?.slice(0, 3) // 상위 3개만
      },
      purpose: item.purpose,
      tags: item.tags,
      timestamp: item.timestamp,
      textLength: item.textLength,
      improvementScore: item.improvementScore
    }));

    logDebug('History retrieved successfully:', result.pagination);

    return createSuccessResponse({
      history: sanitizedData,
      pagination: result.pagination
    });

  } catch (error) {
    logError('Error in get-analysis-history:', error);
    return createErrorResponse(error.message, 500);
  }
}; 