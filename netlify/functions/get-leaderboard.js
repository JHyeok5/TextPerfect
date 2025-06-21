const { createResponse } = require('./utils/response');

// 더미 리더보드 데이터 (실제로는 데이터베이스에서 조회)
const DUMMY_LEADERBOARD = [
  {
    id: 'user-1',
    nickname: '글쓰기마스터',
    documents: 45,
    averageScore: 92,
    totalScore: 4140,
    badges: 5,
    rank: 1
  },
  {
    id: 'user-2', 
    nickname: '완벽주의자',
    documents: 38,
    averageScore: 95,
    totalScore: 3610,
    badges: 4,
    rank: 2
  },
  {
    id: 'user-3',
    nickname: '생산성킹',
    documents: 52,
    averageScore: 87,
    totalScore: 4524,
    badges: 3,
    rank: 3
  },
  {
    id: 'user-4',
    nickname: '꾸준한작가',
    documents: 33,
    averageScore: 89,
    totalScore: 2937,
    badges: 2,
    rank: 4
  },
  {
    id: 'user-5',
    nickname: '문장장인',
    documents: 29,
    averageScore: 94,
    totalScore: 2726,
    badges: 4,
    rank: 5
  },
  {
    id: 'user-6',
    nickname: '신입작가',
    documents: 41,
    averageScore: 85,
    totalScore: 3485,
    badges: 1,
    rank: 6
  },
  {
    id: 'user-7',
    nickname: '열정글쟁이',
    documents: 36,
    averageScore: 88,
    totalScore: 3168,
    badges: 3,
    rank: 7
  },
  {
    id: 'user-8',
    nickname: '문체연구가',
    documents: 25,
    averageScore: 96,
    totalScore: 2400,
    badges: 2,
    rank: 8
  },
  {
    id: 'user-9',
    nickname: '스토리텔러',
    documents: 44,
    averageScore: 83,
    totalScore: 3652,
    badges: 2,
    rank: 9
  },
  {
    id: 'user-10',
    nickname: '편집의달인',
    documents: 31,
    averageScore: 91,
    totalScore: 2821,
    badges: 3,
    rank: 10
  }
];

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
    // 쿼리 파라미터 추출
    const { limit = '10', period = 'monthly' } = event.queryStringParameters || {};
    
    // 리더보드 정렬 (총점 기준 내림차순)
    const sortedLeaderboard = [...DUMMY_LEADERBOARD]
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, parseInt(limit));

    // 순위 재계산
    const leaderboard = sortedLeaderboard.map((user, index) => ({
      ...user,
      rank: index + 1
    }));

    return createResponse(200, {
      success: true,
      leaderboard,
      period,
      total: leaderboard.length,
      lastUpdated: new Date().toISOString()
    }, corsHeaders);

  } catch (error) {
    console.error('Get leaderboard error:', error);
    return createResponse(500, {
      error: 'Internal server error',
      message: '리더보드를 불러오는데 실패했습니다.'
    }, corsHeaders);
  }
}; 