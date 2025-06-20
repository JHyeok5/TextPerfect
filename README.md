# 📝 TextPerfect

> **AI 기반 텍스트 최적화 플랫폼**  
> Claude API를 활용한 목적별 텍스트 최적화 및 분석 도구

[![Website](https://img.shields.io/badge/Website-textperfect.space-blue?style=for-the-badge)](https://textperfect.space)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Netlify](https://img.shields.io/badge/Netlify-Functions-00C7B7?style=for-the-badge&logo=netlify)](https://netlify.com)

## 🌟 주요 기능

### 🎯 **목적별 텍스트 최적화**
- **학술 논문**: 전문적이고 정확한 학술 문체로 변환
- **비즈니스**: 명확하고 설득력 있는 비즈니스 커뮤니케이션
- **기술 문서**: 정확하고 이해하기 쉬운 기술 설명
- **일반 문서**: 자연스럽고 읽기 쉬운 일반 문체

### ⚙️ **세부 맞춤 설정**
- **형식성 수준**: 격식 있는 문체부터 친근한 문체까지
- **간결성 조절**: 상세한 설명부터 핵심만 간추린 내용까지
- **용어 수준**: 전문 용어부터 일반인도 이해할 수 있는 용어까지

### 📊 **텍스트 분석 & 비교**
- **변경 사항 시각화**: 수정된 부분을 명확하게 표시
- **개선 사항 설명**: AI가 왜 그렇게 수정했는지 상세 설명
- **품질 분석**: 가독성, 명확성, 일관성 등 다각도 분석

### 👤 **사용자 인증 시스템**
- **완전한 회원가입/로그인**: 안전한 JWT 기반 인증
- **개인화된 경험**: 사용자별 맞춤 설정 및 이력 관리
- **구독 관리**: 무료/프리미엄 플랜 지원

## 🚀 라이브 데모

**웹사이트**: [https://textperfect.space](https://textperfect.space)

### 📱 주요 페이지
- **대시보드**: 사용자 통계 및 최근 작업 현황
- **에디터**: 실시간 텍스트 최적화 도구
- **템플릿**: 다양한 문서 유형별 템플릿
- **AI 코치**: 개인화된 글쓰기 피드백

## 🛠️ 기술 스택

### Frontend
- **React 18+** - 모던 웹 인터페이스
- **TailwindCSS** - 유틸리티 기반 스타일링
- **Chart.js** - 데이터 시각화
- **React Router** - SPA 라우팅
- **Context API** - 상태 관리

### Backend
- **Netlify Functions** - 서버리스 백엔드
- **Claude API** - AI 텍스트 처리
- **JWT** - 안전한 인증
- **bcrypt** - 비밀번호 암호화

### Database & Storage
- **GitHub Repository** - 사용자 데이터 저장 (Private)
- **localStorage** - 클라이언트 캐싱

### DevOps & Deployment
- **Netlify** - 자동 배포 및 호스팅
- **GitHub Actions** - CI/CD 파이프라인
- **Custom Domain** - textperfect.space

## 🏗️ 아키텍처

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │ Netlify Functions│    │ GitHub Repository│
│                 │    │                 │    │                 │
│ • UI Components │◄──►│ • Authentication│◄──►│ • users.json    │
│ • State Management│   │ • Text Processing│   │ • sessions.json │
│ • API Integration│   │ • User Management│   │ • stats.json    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       
         ▼                       ▼                       
┌─────────────────┐    ┌─────────────────┐              
│   TailwindCSS   │    │   Claude API    │              
│                 │    │                 │              
│ • Responsive UI │    │ • Text Analysis │              
│ • Modern Design │    │ • AI Optimization│             
└─────────────────┘    └─────────────────┘              
```

## 🚀 빠른 시작

### 📋 필수 요구 사항
- **Node.js** 16.0.0 이상
- **npm** 7.0.0 이상
- **Git**

### 📦 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/JHyeok5/TextPerfect.git
   cd TextPerfect
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   # .env 파일 생성
   cp .env.example .env
   
   # 필요한 환경 변수 설정
   GITHUB_USERNAME=your-username
   GITHUB_REPO=TextPerfect-userdata
   GITHUB_TOKEN=your-github-token
   JWT_SECRET=your-jwt-secret
   CLAUDE_API_KEY=your-claude-api-key
   ```

4. **개발 서버 실행**
   ```bash
   npm start
   ```

5. **Netlify Functions 로컬 개발** (선택사항)
   ```bash
   npm run netlify-dev
   ```

### 🌐 브라우저에서 확인
- **프론트엔드**: http://localhost:3000
- **Netlify Dev**: http://localhost:8888

## 📁 프로젝트 구조

```
TextPerfect/
├── 📁 public/                    # 정적 파일
│   ├── index.html
│   ├── manifest.json
│   └── favicon.ico
├── 📁 src/                       # React 소스 코드
│   ├── 📁 components/            # 재사용 가능한 컴포넌트
│   │   ├── 📁 auth/              # 인증 관련 컴포넌트
│   │   ├── 📁 common/            # 공통 UI 컴포넌트
│   │   ├── 📁 editor/            # 텍스트 에디터 컴포넌트
│   │   └── 📁 layout/            # 레이아웃 컴포넌트
│   ├── 📁 contexts/              # React Context
│   │   ├── UserContext.js        # 사용자 상태 관리
│   │   ├── TextContext.js        # 텍스트 상태 관리
│   │   └── AnalyticsContext.js   # 분석 데이터 관리
│   ├── 📁 pages/                 # 페이지 컴포넌트
│   │   ├── HomePage.js           # 홈페이지
│   │   ├── EditorPage.jsx        # 에디터 페이지
│   │   ├── DashboardPage.jsx     # 대시보드
│   │   └── ProfilePage.jsx       # 프로필 페이지
│   ├── 📁 utils/                 # 유틸리티 함수
│   │   ├── api.js                # API 호출 함수
│   │   ├── validation.js         # 입력값 검증
│   │   └── storage.js            # 로컬 스토리지 관리
│   └── 📁 constants/             # 상수 정의
├── 📁 netlify/                   # Netlify Functions
│   └── 📁 functions/             # 서버리스 함수
│       ├── 📁 auth/              # 인증 API
│       │   ├── signup.js         # 회원가입
│       │   ├── login.js          # 로그인
│       │   ├── me.js             # 사용자 정보
│       │   └── logout.js         # 로그아웃
│       ├── optimize.js           # 텍스트 최적화 API
│       └── 📁 utils/             # 백엔드 유틸리티
│           ├── github-storage.js # GitHub 저장소 연동
│           ├── jwt.js            # JWT 토큰 관리
│           ├── password.js       # 비밀번호 관리
│           └── validation.js     # 서버 입력값 검증
├── 📁 docs/                      # 문서
│   ├── API.md                    # API 문서
│   ├── ARCHITECTURE.md           # 아키텍처 가이드
│   └── DEVELOPMENT.md            # 개발 가이드
├── 📁 .ai-guides/                # AI 개발 가이드
│   └── 📁 auth/                  # 인증 시스템 가이드
├── package.json                  # 프로젝트 설정
├── tailwind.config.js           # TailwindCSS 설정
├── netlify.toml                 # Netlify 배포 설정
└── README.md                    # 이 파일
```

## 🔐 보안 기능

### 🛡️ **인증 시스템**
- **JWT 토큰 기반 인증**
- **bcrypt 비밀번호 해싱** (12 rounds)
- **토큰 블랙리스트 관리**
- **자동 로그인/로그아웃**

### 🔒 **데이터 보안**
- **Private GitHub Repository** 사용자 데이터 저장
- **XSS/SQL Injection 방지**
- **입력값 검증 및 정제**
- **Rate Limiting** (분당 60회)

### 🚨 **비밀번호 정책**
- 최소 8자 이상
- 대문자, 소문자, 숫자, 특수문자 포함
- 일반적인 패턴 차단 (password, 123456 등)

## 📊 API 문서

### 🔐 **인증 API**

#### 회원가입
```http
POST /.netlify/functions/auth/signup
Content-Type: application/json

{
  "nickname": "사용자명",
  "email": "user@example.com",
  "password": "SecurePass123!",
  "passwordConfirm": "SecurePass123!"
}
```

#### 로그인
```http
POST /.netlify/functions/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### 🤖 **텍스트 최적화 API**

#### 텍스트 최적화
```http
POST /.netlify/functions/optimize
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "text": "최적화할 텍스트",
  "purpose": "academic",
  "settings": {
    "formality": 0.8,
    "conciseness": 0.6,
    "terminology": 0.7
  }
}
```

더 자세한 API 문서는 [docs/API.md](docs/API.md)를 참조하세요.

## 🎨 UI/UX 특징

### 📱 **반응형 디자인**
- 모바일, 태블릿, 데스크톱 완벽 지원
- TailwindCSS 기반 모던 UI
- 다크/라이트 모드 지원 (예정)

### ⚡ **사용자 경험**
- **실시간 텍스트 최적화**
- **변경 사항 시각화**
- **로딩 상태 표시**
- **에러 처리 및 안내**

### 🎯 **접근성**
- 키보드 네비게이션 지원
- 스크린 리더 호환
- 고대비 색상 지원

## 🧪 테스트

### 🔍 **테스트 실행**
```bash
# 단위 테스트
npm test

# 커버리지 확인
npm run test:coverage

# E2E 테스트 (예정)
npm run test:e2e
```

### 🎯 **테스트 시나리오**
- 인증 플로우 (회원가입, 로그인, 로그아웃)
- 텍스트 최적화 기능
- API 응답 검증
- UI 컴포넌트 렌더링

## 📈 성능 최적화

### ⚡ **프론트엔드 최적화**
- **Code Splitting**: 페이지별 번들 분할
- **Lazy Loading**: 필요한 시점에 컴포넌트 로드
- **Image Optimization**: 이미지 압축 및 최적화
- **Caching**: localStorage 활용 데이터 캐싱

### 🚀 **백엔드 최적화**
- **서버리스 아키텍처**: 자동 스케일링
- **API 응답 최적화**: 불필요한 데이터 제거
- **토큰 관리**: 효율적인 JWT 처리

## 🌍 배포

### 🚀 **Netlify 배포** (추천)
1. Netlify에 GitHub 저장소 연결
2. 환경 변수 설정
3. 자동 배포 활성화

### 📋 **환경 변수 설정**
```env
GITHUB_USERNAME=your-username
GITHUB_REPO=TextPerfect-userdata
GITHUB_TOKEN=your-github-token
JWT_SECRET=your-jwt-secret
CLAUDE_API_KEY=your-claude-api-key
NODE_ENV=production
```

### 🔄 **CI/CD 파이프라인**
- **GitHub Actions**: 자동 테스트 및 배포
- **Netlify**: 프리뷰 배포 및 프로덕션 배포
- **자동 최적화**: 빌드 시 자동 압축 및 최적화

## 🤝 기여하기

### 📝 **기여 방법**
1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경 사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

### 🐛 **버그 리포트**
버그를 발견하셨나요? [Issues](https://github.com/JHyeok5/TextPerfect/issues)에서 버그 리포트를 작성해주세요.

### 💡 **기능 제안**
새로운 기능 아이디어가 있으시다면 [Discussions](https://github.com/JHyeok5/TextPerfect/discussions)에서 제안해주세요.

## 📞 지원 및 문의

- **이메일**: [jhyeok5@gmail.com](mailto:jhyeok5@gmail.com)
- **GitHub Issues**: [버그 리포트 및 기능 요청](https://github.com/JHyeok5/TextPerfect/issues)
- **GitHub Discussions**: [일반적인 질문 및 토론](https://github.com/JHyeok5/TextPerfect/discussions)

## 📜 라이선스

이 프로젝트는 [MIT 라이선스](LICENSE) 하에 배포됩니다.

## 🙏 감사 인사

- **Anthropic**: Claude API 제공
- **Netlify**: 서버리스 호스팅 플랫폼
- **React 팀**: 훌륭한 프론트엔드 프레임워크
- **TailwindCSS**: 유틸리티 기반 CSS 프레임워크
- **오픈소스 커뮤니티**: 다양한 라이브러리와 도구들

---

<div align="center">

**⭐ 이 프로젝트가 도움이 되셨다면 스타를 눌러주세요! ⭐**

Made with ❤️ by [JHyeok5](https://github.com/JHyeok5)

</div>