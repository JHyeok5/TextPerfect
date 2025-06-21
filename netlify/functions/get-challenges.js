const { createResponse } = require('./utils/response');

// 더미 챌린지 데이터 (실제로는 데이터베이스에서 조회)
const DUMMY_CHALLENGES = [
  {
    id: 'challenge-1',
    title: '30일 연속 글쓰기 챌린지',
    description: '매일 최소 500자 이상의 글을 작성하고 최적화해보세요. 연속 달성 시 특별 배지를 드립니다!',
    participants: 1247,
    duration: '30일',
    reward: '글쓰기 마스터 배지',
    joined: false,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    type: 'consecutive',
    target: 30,
    progress: null
  },
  {
    id: 'challenge-2',
    title: '이번 달 100개 문서 달성',
    description: '한 달 동안 총 100개의 문서를 최적화하여 생산성 킹이 되어보세요!',
    participants: 856,
    duration: '1개월',
    reward: '생산성 킹 배지 + 프리미엄 1개월',
    joined: true,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    type: 'count',
    target: 100,
    progress: {
      current: 23,
      target: 100
    }
  },
  {
    id: 'challenge-3',
    title: '완벽한 점수 도전',
    description: '연속으로 95점 이상의 완벽한 최적화 점수를 달성해보세요!',
    participants: 432,
    duration: '2주',
    reward: '완벽주의자 배지',
    joined: false,
    startDate: '2024-01-15',
    endDate: '2024-01-29',
    type: 'score',
    target: 95,
    progress: null
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
    // 현재 날짜 기준으로 활성 챌린지 필터링
    const now = new Date();
    const activeChallenges = DUMMY_CHALLENGES.filter(challenge => {
      const endDate = new Date(challenge.endDate);
      return endDate >= now;
    });

    // 사용자별 참여 상태 확인 (실제로는 JWT 토큰에서 사용자 ID를 추출하여 확인)
    const challenges = activeChallenges.map(challenge => ({
      ...challenge,
      // 실제로는 사용자의 참여 상태와 진행률을 데이터베이스에서 조회
      joined: challenge.joined,
      progress: challenge.progress
    }));

    return createResponse(200, {
      success: true,
      challenges,
      total: challenges.length
    }, corsHeaders);

  } catch (error) {
    console.error('Get challenges error:', error);
    return createResponse(500, {
      error: 'Internal server error',
      message: '챌린지 목록을 불러오는데 실패했습니다.'
    }, corsHeaders);
  }
}; 