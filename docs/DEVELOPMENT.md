# 개발 가이드 (C단계 Phase 1 완성)

## 개발 환경 설정
- Node.js 18 이상 권장
- 의존성 설치: `npm install`
- 개발 서버 실행: `npm start`
- 빌드: `npm run build`
- Netlify Functions: `netlify dev` (로컬 서버리스)
- **환경 변수 체크**: `npm run check-env`

## 필수 환경 변수 (C단계 Phase 1 완성)
```bash
# AI 서비스
CLAUDE_API_KEY=your_claude_api_key_here

# Stripe 결제 시스템 (C단계 Phase 1)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# 프론트엔드용
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## 사용자 유형별 개발 가이드

### 사용자 제한 로직 구현
```javascript
// UserContext에서 사용자 유형 확인
const { getUserPlan, canAccessPremium } = useUser();
const userPlan = getUserPlan(); // 'GUEST', 'FREE', 'PREMIUM'

// 기능 제한 체크
if (isPremiumFeature && !canAccessPremium) {
  toast.error('프리미엄 플랜에서만 이용 가능합니다.');
  return;
}
```

### 월 문서 수 추적
```javascript
// 문서 생성 전 체크
const { canCreateDocument, addDocument } = useUser();
if (!canCreateDocument()) {
  toast.error('월 문서 수 제한에 도달했습니다.');
  return;
}

// 문서 생성 후 카운트 증가
addDocument();
```

### Stripe 결제 시스템 사용법 (C단계 Phase 1)
```javascript
// useStripe 훅 사용
import { useStripe } from '../hooks';

const { subscription, startCheckout, openCustomerPortal, loading } = useStripe();

// 결제 시작
const handleUpgrade = async () => {
  try {
    await startCheckout('PREMIUM_MONTHLY');
  } catch (error) {
    toast.error('결제 세션 생성에 실패했습니다.');
  }
};

// 구독 관리 포털 열기
const handleManageSubscription = async () => {
  try {
    await openCustomerPortal();
  } catch (error) {
    toast.error('고객 포털 접근에 실패했습니다.');
  }
};
```

## 코딩 컨벤션
- **스타일**: Prettier, ESLint, TailwindCSS
- **네이밍**: camelCase(함수/변수), PascalCase(컴포넌트), UPPER_SNAKE_CASE(상수)
- **주석**: JSDoc, 함수/컴포넌트 설명 필수
- **폴더/파일**: 기능별/역할별로 분리, index.js로 export 정리
- **테스트**: 주요 로직/유틸 함수는 단위 테스트 권장
- **사용자 제한**: 모든 기능에 사용자 유형별 제한 로직 필수 적용
- **결제 연동**: Stripe 관련 기능은 에러 핸들링 필수

## Git 브랜치 전략
- `main`: 배포/운영용(항상 안정 상태 유지)
- `dev`: 통합 개발(기능 병합 전 테스트)
- `feature/이름`: 기능별 개발 브랜치
- PR(Merge Request) 시 코드리뷰 필수
- 커밋 메시지: [타입] 간결한 설명 (예: [feat] 구독 결제 기능 추가)

## C단계 Phase 1 완성 체크리스트
- [x] Stripe 결제 시스템 구현
  - [x] 결제 세션 생성 (stripe-create-checkout.js)
  - [x] 웹훅 이벤트 처리 (stripe-webhook.js)
  - [x] 고객 포털 (stripe-customer-portal.js)
  - [x] 구독 상태 조회 (stripe-get-subscription.js)
- [x] 프론트엔드 Stripe 연동
  - [x] useStripe 훅 구현
  - [x] Stripe 유틸리티 함수
  - [x] 구독 페이지 리뉴얼
  - [x] 결제 성공 페이지
- [x] 사용자 대시보드 통계
  - [x] 실시간 사용량 추적
  - [x] 시각적 진행률 바
  - [x] 주간 활동 차트
  - [x] 구독 상태 표시
- [x] 환경 변수 관리 시스템
- [x] 라우터 설정 및 페이지 연동

---

## 🚀 C단계 Phase 2 구현 가이드 (진행 예정)

### 1. AI 분석 결과 저장 시스템

#### 필요한 기능
- 분석 히스토리 영구 저장 (GitHub Storage)
- 사용자별 글쓰기 패턴 분석
- 개선 추세 그래프
- 히스토리 검색/필터링

#### 구현 계획
```javascript
// 1. 분석 결과 저장 Function
// netlify/functions/save-analysis.js
exports.handler = async (event) => {
  const { userId, analysisData } = JSON.parse(event.body);
  
  // GitHub Storage에 분석 결과 저장
  const historyData = {
    id: generateId(),
    userId,
    originalText: analysisData.originalText,
    optimizedText: analysisData.optimizedText,
    analysis: analysisData.analysis,
    timestamp: new Date().toISOString(),
    tags: extractTags(analysisData.purpose)
  };
  
  await saveToGitHub(`users/${userId}/history/${historyData.id}.json`, historyData);
  
  return { statusCode: 200, body: JSON.stringify({ success: true }) };
};

// 2. 히스토리 조회 Function
// netlify/functions/get-analysis-history.js
exports.handler = async (event) => {
  const { userId, page = 1, limit = 10, search, tags } = event.queryStringParameters;
  
  const historyFiles = await getFromGitHub(`users/${userId}/history/`);
  const filteredHistory = filterHistory(historyFiles, { search, tags });
  const paginatedResults = paginate(filteredHistory, page, limit);
  
  return { statusCode: 200, body: JSON.stringify(paginatedResults) };
};
```

#### 프론트엔드 구조
```
src/pages/
├── HistoryPage.jsx           # 분석 히스토리 메인 페이지
├── HistoryDetailPage.jsx     # 상세 분석 결과 보기
src/components/history/
├── HistoryList.jsx           # 히스토리 목록
├── HistoryCard.jsx           # 개별 히스토리 카드
├── HistorySearch.jsx         # 검색/필터 컴포넌트
├── PatternAnalysis.jsx       # 글쓰기 패턴 분석
└── TrendChart.jsx            # 개선 추세 차트
```

### 2. 소셜 로그인 구현

#### OAuth 제공자
- Google OAuth 2.0
- GitHub OAuth

#### 구현 계획
```javascript
// 1. Google OAuth Function
// netlify/functions/auth-google.js
const { OAuth2Client } = require('google-auth-library');

exports.handler = async (event) => {
  const { code, state } = JSON.parse(event.body);
  
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
  
  const { tokens } = await client.getToken(code);
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  
  const payload = ticket.getPayload();
  const user = await findOrCreateUser({
    email: payload.email,
    nickname: payload.name,
    avatar: payload.picture,
    provider: 'google',
    providerId: payload.sub
  });
  
  const token = generateJWT(user);
  return { statusCode: 200, body: JSON.stringify({ user, token }) };
};

// 2. GitHub OAuth Function
// netlify/functions/auth-github.js
const axios = require('axios');

exports.handler = async (event) => {
  const { code } = JSON.parse(event.body);
  
  // GitHub에서 액세스 토큰 교환
  const tokenResponse = await axios.post('https://github.com/login/oauth/access_token', {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code
  });
  
  const accessToken = new URLSearchParams(tokenResponse.data).get('access_token');
  
  // 사용자 정보 조회
  const userResponse = await axios.get('https://api.github.com/user', {
    headers: { Authorization: `token ${accessToken}` }
  });
  
  const user = await findOrCreateUser({
    email: userResponse.data.email,
    nickname: userResponse.data.login,
    avatar: userResponse.data.avatar_url,
    provider: 'github',
    providerId: userResponse.data.id.toString()
  });
  
  const token = generateJWT(user);
  return { statusCode: 200, body: JSON.stringify({ user, token }) };
};
```

#### 필요한 환경 변수 추가
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-domain.com/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 3. 구현 우선순위 (Phase 2 - 1주)

#### Day 1-3: 분석 결과 저장 시스템
- [ ] GitHub Storage 기반 히스토리 저장 Function 구현
- [ ] 프론트엔드 히스토리 페이지 구현
- [ ] 검색/필터링 기능 구현

#### Day 4-5: 소셜 로그인
- [ ] Google OAuth 2.0 연동
- [ ] GitHub OAuth 연동
- [ ] 기존 계정 연동 로직

#### Day 6-7: 통합 및 테스트
- [ ] 전체 기능 통합 테스트
- [ ] 사용자 경험 개선
- [ ] 문서 업데이트

---

## 배포 가이드

### Netlify 환경 변수 설정
1. Netlify 대시보드 → Site settings → Environment variables
2. 모든 필수 환경 변수 추가
3. Stripe 웹훅 엔드포인트 설정: `https://your-domain.netlify.app/.netlify/functions/stripe-webhook`

### Stripe 설정
1. Stripe 대시보드에서 웹훅 엔드포인트 추가
2. 필요한 이벤트 선택:
   - checkout.session.completed
   - customer.subscription.created/updated/deleted
   - invoice.payment_succeeded/failed
3. 웹훅 시크릿 키를 환경 변수에 추가

### 배포 체크리스트
- [ ] 모든 환경 변수 설정 완료
- [ ] Stripe 웹훅 엔드포인트 등록
- [ ] 결제 테스트 완료
- [ ] 구독 상태 동기화 확인
- [ ] 프론트엔드 빌드 성공
- [ ] Functions 배포 확인 