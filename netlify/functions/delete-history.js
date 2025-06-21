const jwt = require('jsonwebtoken');
const { Octokit } = require('@octokit/rest');

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

// 분석 삭제
const deleteAnalysis = async (userId, analysisId) => {
  try {
    const path = `users/${userId}/analyses.json`;
    
    // 기존 분석 데이터 조회
    let analyses = [];
    let fileSha = null;
    
    try {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path: path,
      });

      const content = Buffer.from(fileData.content, 'base64').toString('utf8');
      analyses = JSON.parse(content);
      fileSha = fileData.sha;
    } catch (error) {
      if (error.status === 404) {
        throw new Error('분석 데이터를 찾을 수 없습니다.');
      }
      throw error;
    }

    // 해당 분석 찾기 및 삭제
    const initialLength = analyses.length;
    analyses = analyses.filter(analysis => analysis.id !== analysisId);

    if (analyses.length === initialLength) {
      throw new Error('삭제할 분석을 찾을 수 없습니다.');
    }

    // 업데이트된 데이터 저장
    const updatedContent = JSON.stringify(analyses, null, 2);

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: path,
      message: `Delete analysis ${analysisId} for user ${userId}`,
      content: Buffer.from(updatedContent).toString('base64'),
      sha: fileSha,
    });

    return true;
  } catch (error) {
    console.error('분석 삭제 실패:', error);
    throw error;
  }
};

exports.handler = async (event, context) => {
  // CORS 헤더
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
  };

  // OPTIONS 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // DELETE 요청만 허용
  if (event.httpMethod !== 'DELETE') {
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

    // 요청 본문에서 분석 ID 추출
    const body = JSON.parse(event.body || '{}');
    const { analysisId } = body;

    if (!analysisId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: '분석 ID가 필요합니다.' 
        }),
      };
    }

    // 분석 삭제
    await deleteAnalysis(decoded.userId, analysisId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: '분석이 성공적으로 삭제되었습니다.'
      }),
    };

  } catch (error) {
    console.error('분석 삭제 에러:', error);

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