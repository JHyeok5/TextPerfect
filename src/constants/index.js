// 상수 export용 index.js 

// 구독 플랜 정보
export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: ['기본 분석', '월 10개 문서', '최대 3,000자'],
    limit: {
      monthlyDocs: 10,
      maxTextLength: 3000,
    },
  },
  PREMIUM: {
    name: 'Premium',
    price: 9900,
    features: ['고급 분석', '모든 템플릿', 'AI 코치', '월 100개 문서', '최대 10,000자', '우선 지원'],
    limit: {
      monthlyDocs: 100,
      maxTextLength: 10000,
    },
  },
};

// 레벨링 시스템 설정
export const LEVELS = [
  { level: 1, exp: 0, reward: '뱃지: 시작' },
  { level: 2, exp: 100, reward: '프리미엄 템플릿 1개' },
  { level: 3, exp: 300, reward: 'AI 코치 추가 피드백' },
  { level: 4, exp: 700, reward: '배경 테마 해금' },
  { level: 5, exp: 1500, reward: 'PRO 할인권' },
  // ...확장 가능
];

// 글쓰기 분석 카테고리
export const ANALYSIS_CATEGORIES = [
  '문장 길이',
  '어휘 다양성',
  '문법 오류',
  '가독성',
  '논리적 흐름',
  '표현력',
  // ...확장 가능
];

// API 엔드포인트
export const API_ENDPOINTS = {
  AUTH: 'https://zingy-pixie-14c20e.netlify.app/.netlify/functions/auth',
  USER: 'https://zingy-pixie-14c20e.netlify.app/.netlify/functions/user',
  ANALYSIS: 'https://zingy-pixie-14c20e.netlify.app/.netlify/functions/analysis',
  OPTIMIZE: 'https://zingy-pixie-14c20e.netlify.app/.netlify/functions/optimize',
  SUBSCRIPTION: 'https://zingy-pixie-14c20e.netlify.app/.netlify/functions/subscription',
  TEMPLATES: 'https://zingy-pixie-14c20e.netlify.app/.netlify/functions/templates',
  COACH: 'https://zingy-pixie-14c20e.netlify.app/.netlify/functions/coach',
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  USER: 'tp_user',
  TOKEN: 'tp_token',
  SETTINGS: 'tp_settings',
  CACHE: 'tp_cache',
  THEME: 'tp_theme',
}; 