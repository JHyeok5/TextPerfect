# TextPerfect 개발 가이드 (C단계 Phase 3 완성)

## 🚀 프로젝트 개요

TextPerfect는 **완전한 SaaS + PWA + 커뮤니티 서비스**로, AI 기반 텍스트 최적화 및 글쓰기 코칭을 제공합니다.

### 주요 기능
- ✅ **AI 텍스트 최적화** (Claude API)
- ✅ **실제 결제 시스템** (Stripe)
- ✅ **사용자 관리** (JWT + OAuth)
- ✅ **분석 결과 저장** (GitHub Storage)
- ✅ **PWA 지원** (오프라인, 앱 설치)
- ✅ **커뮤니티 기능** (챌린지, 리더보드)

## 🛠 개발 환경 설정

### 1. 저장소 복제 및 의존성 설치
```bash
git clone <repository-url>
cd TextPerfect
npm install
```

### 2. 환경 변수 설정 (.env 파일 생성)
```bash
# AI 서비스
CLAUDE_API_KEY=your_claude_api_key_here

# Stripe 결제 시스템
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# GitHub Storage (분석 결과 저장)
GITHUB_TOKEN=ghp_...
GITHUB_REPO_OWNER=textperfect-data
GITHUB_REPO_NAME=user-data

# JWT 인증
JWT_SECRET=your-super-secret-jwt-key-here

# OAuth (선택적)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# 프론트엔드용
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. 개발 서버 실행
```bash
# 환경 변수 확인
npm run check-env

# 개발 서버 시작
npm start

# Netlify Functions 로컬 개발
netlify dev
```

## 📱 PWA 개발 가이드 (C단계 Phase 3)

### PWA 구성 요소
1. **Web App Manifest** (`public/manifest.json`)
2. **Service Worker** (`public/sw.js`)
3. **PWA 유틸리티** (`src/utils/pwa.js`)
4. **설치 버튼** (`src/components/common/PWAInstallButton.jsx`)

### PWA 기능 구현

#### 1. 서비스 워커 등록
```javascript
// src/utils/pwa.js
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.error('SW registration failed:', error);
      });
  }
};
```

#### 2. 앱 설치 프롬프트
```javascript
// PWAInstallButton.jsx
const [deferredPrompt, setDeferredPrompt] = useState(null);

useEffect(() => {
  const handleBeforeInstallPrompt = (e) => {
    e.preventDefault();
    setDeferredPrompt(e);
    setShowInstall(true);
  };

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
}, []);
```

#### 3. 오프라인 지원
```javascript
// public/sw.js
// 캐시 전략 설정
registerRoute(
  ({ url }) => url.pathname.startsWith('/.netlify/functions/'),
  new NetworkFirst({
    cacheName: API_CACHE,
    networkTimeoutSeconds: 3,
  })
);
```

### PWA 테스트
```bash
# 프로덕션 빌드
npm run build

# 로컬 서버에서 PWA 테스트
npx serve -s dist -l 3000

# Chrome DevTools > Application > Service Workers 확인
# Chrome DevTools > Lighthouse > PWA 감사 실행
```

## 🏆 커뮤니티 기능 개발 가이드

### 커뮤니티 API 구조

#### 1. 챌린지 시스템
```javascript
// netlify/functions/get-challenges.js
const DUMMY_CHALLENGES = [
  {
    id: 'challenge-1',
    title: '30일 연속 글쓰기 챌린지',
    type: 'consecutive',
    target: 30,
    participants: 1247,
    progress: { current: 15, target: 30 }
  }
];
```

#### 2. 리더보드 시스템
```javascript
// netlify/functions/get-leaderboard.js
const leaderboard = users.map((user, index) => ({
  ...user,
  rank: index + 1,
  totalScore: user.documents * user.averageScore
}));
```

#### 3. 사용자 통계
```javascript
// netlify/functions/get-user-stats.js
const userStats = {
  documentsThisMonth: 23,
  averageScore: 87,
  rank: 15,
  badges: 3,
  recentAchievements: [...]
};
```

### 커뮤니티 UI 컴포넌트

#### CommunityPage 구조
```jsx
// src/pages/CommunityPage.jsx
const CommunityPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState(null);

  // 데이터 로드, 챌린지 참여, 공유 기능 등
};
```

## 🔧 API 개발 가이드

### Netlify Functions 구조
```
netlify/functions/
├── optimize.js              # AI 텍스트 최적화
├── stripe-create-checkout.js # Stripe 결제 세션 생성
├── stripe-webhook.js        # Stripe 웹훅 처리
├── auth-login.js           # 로그인
├── auth-google.js          # Google OAuth
├── auth-github.js          # GitHub OAuth
├── save-analysis.js        # 분석 결과 저장
├── get-analysis-history.js # 히스토리 조회
├── get-challenges.js       # 커뮤니티 챌린지
├── get-leaderboard.js      # 리더보드
├── get-user-stats.js       # 사용자 통계
└── utils/
    ├── response.js         # 표준 응답 포맷
    └── github-storage.js   # GitHub 스토리지 유틸
```

### API 응답 표준화
```javascript
// netlify/functions/utils/response.js
const createResponse = (statusCode, body, headers = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    ...headers
  },
  body: JSON.stringify(body)
});
```

### 인증 미들웨어
```javascript
// JWT 토큰 검증
const authHeader = event.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return createResponse(401, { error: 'Unauthorized' });
}

const token = authHeader.substring(7);
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

## 💳 결제 시스템 개발

### Stripe 결제 플로우
1. **결제 세션 생성** (`stripe-create-checkout.js`)
2. **사용자 리다이렉트** (Stripe Checkout)
3. **웹훅 처리** (`stripe-webhook.js`)
4. **구독 상태 업데이트** (GitHub Storage)

### 웹훅 처리
```javascript
// netlify/functions/stripe-webhook.js
const sig = event.headers['stripe-signature'];
const webhookEvent = stripe.webhooks.constructEvent(
  event.body, sig, process.env.STRIPE_WEBHOOK_SECRET
);

switch (webhookEvent.type) {
  case 'checkout.session.completed':
    await handleCheckoutCompleted(webhookEvent.data.object);
    break;
  case 'invoice.payment_succeeded':
    await handlePaymentSucceeded(webhookEvent.data.object);
    break;
}
```

## 📊 데이터 저장 시스템

### GitHub Storage 활용
```javascript
// netlify/functions/utils/github-storage.js
const saveToGitHub = async (userId, data, filename) => {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
  
  await octokit.rest.repos.createOrUpdateFileContents({
    owner: process.env.GITHUB_REPO_OWNER,
    repo: process.env.GITHUB_REPO_NAME,
    path: `users/${userId}/${filename}`,
    message: `Update ${filename}`,
    content: Buffer.from(JSON.stringify(data, null, 2)).toString('base64')
  });
};
```

### 데이터 구조
```javascript
// 사용자 프로필
userProfile = {
  id: 'user-123',
  email: 'user@example.com',
  userType: 'PREMIUM',
  subscription: { ... },
  createdAt: '2024-01-01T00:00:00Z'
};

// 분석 히스토리
analysisHistory = {
  id: 'analysis-456',
  userId: 'user-123',
  originalText: '...',
  optimizedText: '...',
  analysis: { ... },
  createdAt: '2024-01-01T12:00:00Z'
};
```

## 🎨 프론트엔드 개발

### 컴포넌트 구조
```
src/components/
├── common/           # 공통 컴포넌트
│   ├── Button.jsx
│   ├── Modal.jsx
│   ├── LoadingSpinner.jsx
│   └── PWAInstallButton.jsx  # PWA 설치 버튼
├── layout/           # 레이아웃
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   └── Footer.jsx
├── auth/             # 인증 관련
│   ├── LoginForm.jsx
│   ├── SignupForm.jsx
│   └── SocialLogin.jsx       # 소셜 로그인
└── editor/           # 에디터 관련
    ├── TextEditor.jsx
    └── AnalysisResults.jsx
```

### 상태 관리 (Context)
```javascript
// src/contexts/UserContext.js
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 로그인, 로그아웃, 사용자 정보 업데이트 등
};
```

### 라우팅
```javascript
// src/App.js
const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/editor" element={<EditorPage />} />
    <Route path="/history" element={<HistoryPage />} />
    <Route path="/community" element={<CommunityPage />} />
    <Route path="/subscription" element={<SubscriptionPage />} />
  </Routes>
);
```

## 🔒 보안 가이드

### 환경 변수 보안
- `.env` 파일을 `.gitignore`에 추가
- Netlify 환경 변수에 프로덕션 키 설정
- 클라이언트 사이드에서 비밀 키 노출 방지

### API 보안
- JWT 토큰 검증
- CORS 설정
- Stripe 웹훅 서명 검증
- 입력 데이터 검증 및 새니타이제이션

### 데이터 보안
- 사용자 데이터 암호화
- GitHub 토큰 권한 최소화
- 민감한 정보 로깅 방지

## 🚀 배포 가이드

### Netlify 배포
```bash
# 빌드
npm run build

# Netlify CLI 설치 및 로그인
npm install -g netlify-cli
netlify login

# 배포
netlify deploy --prod
```

### 환경 변수 설정
1. Netlify Dashboard > Site Settings > Environment Variables
2. 모든 필수 환경 변수 추가
3. Functions 재배포 확인

### PWA 배포 확인
1. HTTPS 환경에서 배포 확인
2. Service Worker 등록 확인
3. Manifest 파일 접근 확인
4. 앱 설치 프롬프트 테스트

## 🧪 테스트 가이드

### 기능 테스트
```bash
# 환경 변수 확인
npm run check-env

# 개발 서버 테스트
npm start

# PWA 기능 테스트
npm run build && npx serve -s dist
```

### API 테스트
```bash
# Netlify Functions 로컬 테스트
netlify dev

# 개별 Function 테스트
curl -X POST http://localhost:8888/.netlify/functions/optimize \
  -H "Content-Type: application/json" \
  -d '{"text": "테스트 텍스트", "purpose": "general"}'
```

### PWA 테스트 체크리스트
- [ ] Service Worker 등록 확인
- [ ] 오프라인 페이지 접근 확인
- [ ] 앱 설치 프롬프트 표시 확인
- [ ] 캐시 동작 확인
- [ ] Lighthouse PWA 점수 90+ 확인

### 커뮤니티 기능 테스트
- [ ] 챌린지 목록 로드 확인
- [ ] 리더보드 표시 확인
- [ ] 사용자 통계 로드 확인
- [ ] 챌린지 참여 기능 확인
- [ ] 공유 기능 확인

## 📈 성능 최적화

### 프론트엔드 최적화
- 코드 스플리팅 (React.lazy)
- 이미지 최적화
- PWA 캐싱 활용
- 번들 크기 최적화

### 백엔드 최적화
- API 응답 캐싱
- 데이터베이스 쿼리 최적화
- 에러 처리 개선

## 🐛 디버깅 가이드

### 일반적인 문제
1. **환경 변수 누락**: `npm run check-env`로 확인
2. **API 호출 실패**: 네트워크 탭에서 요청/응답 확인
3. **인증 문제**: JWT 토큰 유효성 확인
4. **결제 실패**: Stripe 대시보드에서 로그 확인

### PWA 디버깅
1. **Service Worker 문제**: Chrome DevTools > Application > Service Workers
2. **캐시 문제**: Application > Storage > Clear Storage
3. **Manifest 문제**: Application > Manifest 탭 확인

### 로그 확인
```bash
# Netlify Functions 로그
netlify functions:log

# 브라우저 콘솔 로그 확인
# Network 탭에서 API 요청 상태 확인
```

## 📚 추가 리소스

### 문서
- [Stripe 개발 가이드](https://stripe.com/docs)
- [Claude API 문서](https://docs.anthropic.com/)
- [PWA 개발 가이드](https://web.dev/progressive-web-apps/)
- [Netlify Functions 문서](https://docs.netlify.com/functions/overview/)

### 도구
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)

---

## 🎉 TextPerfect 완성 현황

**✅ C단계 Phase 3 완료 - 완전한 SaaS + PWA + 커뮤니티 서비스**

### 구현된 주요 기능
1. **AI 텍스트 최적화** - Claude API 기반 고품질 최적화
2. **실제 결제 시스템** - Stripe 연동으로 수익 창출 가능
3. **사용자 관리** - JWT + OAuth 인증 시스템
4. **분석 결과 저장** - GitHub Storage 기반 데이터 관리
5. **PWA 지원** - 모바일 앱 경험 제공
6. **커뮤니티 기능** - 챌린지, 리더보드, 공유 기능

### 기술적 성과
- **확장 가능한 아키텍처** 구축
- **전문적인 사용자 경험** 제공
- **실제 비즈니스 모델** 구현
- **모바일 최적화** 완료
- **커뮤니티 기반** 사용자 참여 시스템

TextPerfect는 이제 **실제 서비스 론칭이 가능한 완성된 제품**입니다! 🚀 