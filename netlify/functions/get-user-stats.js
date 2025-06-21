const { createResponse } = require('./utils/response');
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };

  // OPTIONS 요청 처리
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, { message: 'OK' }, corsHeaders);
  }

  // GET 요청만 허용
  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' }, corsHeaders);
  }

  try {
    // JWT 토큰 검증
    const authHeader = event.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createResponse(401, {
        error: 'Unauthorized',
        message: '인증이 필요합니다.'
      }, corsHeaders);
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    } catch (jwtError) {
      return createResponse(401, {
        error: 'Invalid token',
        message: '유효하지 않은 토큰입니다.'
      }, corsHeaders);
    }

    const userId = decoded.userId;

    // 더미 사용자 통계 데이터 (실제로는 데이터베이스에서 조회)
    const userStats = {
      userId,
      documentsThisMonth: 23,
      totalDocuments: 156,
      averageScore: 87,
      bestScore: 96,
      rank: 15,
      badges: 3,
      streakDays: 7,
      totalCharacters: 125000,
      improvementRate: 12, // 지난 달 대비 향상률
      monthlyProgress: {
        target: 50,
        current: 23,
        percentage: 46
      },
      recentAchievements: [
        {
          id: 'achievement-1',
          title: '일주일 연속 작성',
          description: '7일 연속으로 글을 작성했습니다',
          earnedAt: '2024-01-20T10:30:00Z',
          badge: '🔥'
        },
        {
          id: 'achievement-2',
          title: '90점 이상 달성',
          description: '분석 점수 90점 이상을 달성했습니다',
          earnedAt: '2024-01-18T14:20:00Z',
          badge: '⭐'
        }
      ]
    };

    return createResponse(200, {
      success: true,
      stats: userStats
    }, corsHeaders);

  } catch (error) {
    console.error('Get user stats error:', error);
    return createResponse(500, {
      error: 'Internal server error',
      message: '사용자 통계를 불러오는데 실패했습니다.'
    }, corsHeaders);
  }
}; 