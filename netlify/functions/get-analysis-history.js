const jwt = require('jsonwebtoken');
const { Octokit } = require('@octokit/rest');
const { 
  createSuccessResponse, 
  createErrorResponse, 
  createCorsResponse,
  logDebug,
  logError 
} = require('./utils/response');
const { getUserHistory } = require('./utils/github-storage');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = process.env.GITHUB_OWNER;
const GITHUB_REPO = process.env.GITHUB_REPO;

// GitHub 클라이언트 초기화
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
});

// JWT 토큰 검증
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// 분석 히스토리 조회
const getAnalysisHistory = async (userId, page = 1, limit = 10) => {
  try {
    const path = `users/${userId}/analyses.json`;
    
    try {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: path,
      });

      const content = Buffer.from(fileData.content, 'base64').toString('utf8');
      const analyses = JSON.parse(content);

      // 날짜순으로 정렬 (최신순)
      const sortedAnalyses = analyses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // 페이지네이션
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedAnalyses = sortedAnalyses.slice(startIndex, endIndex);

      const totalPages = Math.ceil(sortedAnalyses.length / limit);

      return {
        analyses: paginatedAnalyses,
        currentPage: page,
        totalPages,
        totalCount: sortedAnalyses.length
      };
    } catch (error) {
      if (error.status === 404) {
        // 파일이 없으면 빈 배열 반환
        return {
          analyses: [],
          currentPage: 1,
          totalPages: 1,
          totalCount: 0
        };
      }
      throw error;
    }
  } catch (error) {
    console.error('분석 히스토리 조회 실패:', error);
    throw new Error('분석 히스토리를 불러오는데 실패했습니다.');
  }
};

exports.handler = async (event, context) => {
  // CORS 헤더
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  // OPTIONS 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // GET 요청만 허용
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: 'Method not allowed' 
      }),
    };
  }

  try {
    // Authorization 헤더에서 토큰 추출
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: '인증 토큰이 필요합니다.' 
        }),
      };
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: '유효하지 않은 토큰입니다.' 
        }),
      };
    }

    // 쿼리 파라미터에서 페이지 정보 추출
    const queryParams = event.queryStringParameters || {};
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 10;

    // 분석 히스토리 조회
    const historyData = await getAnalysisHistory(decoded.userId, page, limit);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        data: historyData
      }),
    };

  } catch (error) {
    console.error('분석 히스토리 조회 에러:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: error.message || '서버 오류가 발생했습니다.'
      }),
    };
  }
}; 