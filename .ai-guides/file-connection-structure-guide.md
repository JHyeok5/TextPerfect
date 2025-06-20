# TextPerfect 파일 연결 구조 및 의존성 매핑 가이드

## 📋 **문서 개요**

이 문서는 TextPerfect 프로젝트의 모든 파일들이 서로 어떻게 연결되어 있는지, 의존성 관계와 데이터 흐름을 상세히 매핑한 종합 가이드입니다.

**최종 업데이트**: 2025년 6월 21일 - 번들 최적화 및 성능 개선 완료

---

## 🏗️ **1. 전체 아키텍처 구조**

### **진입점 및 핵심 흐름**
```
index.js → App.js → Context Providers → Layout → Pages (Lazy Loaded) → Components
```

### **레이어별 구조**
1. **Entry Layer**: `index.js` (React 앱 마운트)
2. **App Layer**: `App.js` (라우팅, Context, ErrorBoundary, Code Splitting)
3. **Context Layer**: 전역 상태 관리 (User, App, Analytics, Text)
4. **Layout Layer**: 공통 레이아웃 (Header, Sidebar, Footer)
5. **Page Layer**: 라우트별 페이지 컴포넌트 (React.lazy 적용)
6. **Component Layer**: 재사용 가능한 UI 컴포넌트 (동적 import 적용)
7. **Utils Layer**: 유틸리티 함수 및 상수

---

## 🔗 **2. 파일별 상세 연결 매핑**

### **📁 진입점 (Entry Point)**

#### `src/index.js`
```javascript
의존성:
├── React (createRoot)
├── react-router-dom (BrowserRouter)
├── ./index.css
└── ./App.js

역할: React 앱의 진입점
제공: DOM 마운트, 라우터 설정
```

#### `src/App.js` ⭐ **번들 최적화 적용**
```javascript
의존성:
├── React (Suspense, lazy, ErrorBoundary)
├── react-router-dom (Routes, Route)
├── 4개 Context Providers
├── Layout 컴포넌트
├── 11개 페이지 컴포넌트 (React.lazy로 코드 스플리팅)
├── LoadingSpinner (Suspense fallback)
└── UsageLimitModal

역할: 앱의 메인 구조 정의, 성능 최적화
제공: 전역 상태, 라우트 기반 코드 스플리팅, 에러 처리
최적화: React.lazy를 통한 페이지별 청크 분할
```

### **📁 페이지 레이어 (Pages) - 코드 스플리팅 적용**

#### ✅ **완전 구현된 페이지들 (모두 Lazy Loading 적용)**
1. **`HomePage.js`** - 랜딩 페이지 (React.lazy)
2. **`EditorPage.jsx`** - 텍스트 에디터 (React.lazy)
3. **`AnalysisPage.jsx`** - 분석 결과 (React.lazy)
4. **`TemplatesPage.jsx`** - 템플릿 라이브러리 (React.lazy)
5. **`CoachingPage.jsx`** - AI 코칭 (React.lazy)
6. **`ProfilePage.jsx`** - 사용자 프로필 (React.lazy)
7. **`SubscriptionPage.jsx`** - 구독 관리 (React.lazy)
8. **`AboutPage.js`** - 서비스 소개 (React.lazy)
9. **`ResultsPage.js`** - 최적화 결과 (React.lazy)
10. **`NotFoundPage.js`** - 404 에러 (React.lazy)
11. **`DashboardPage.jsx`** - 대시보드 (React.lazy, heroicons 최적화 적용)

### **📁 컴포넌트 레이어 (Components) - 동적 Import 적용**

#### ✅ **완전 구현된 컴포넌트들**

**Common 컴포넌트 (9개) - 트리 셰이킹 최적화**
- `Header.js` ✅ (named export)
- `Footer.js` ✅ (named export)
- `Button.jsx` ✅ (named export)
- `Card.jsx` ✅ (named export)
- `Badge.jsx` ✅ (named export)
- `Modal.jsx` ✅ (named export)
- `LoadingSpinner.jsx` ✅ (named export, Suspense fallback용)
- `ProgressBar.jsx` ✅ (named export)
- `UsageLimitModal.js` ✅ (named export)

**Analytics 컴포넌트 (3개) - 동적 Import 적용**
- `ComparisonView.js` ✅ (lazy import)
- `AnalysisChart.js` ✅ (lazy import)
- `SettingsPanel.js` ✅ (lazy import)

**Editor 컴포넌트 (3개) - 동적 Import 적용**
- `TextEditor.js` ✅ (lazy import)
- `AnalysisIndicators.js` ✅ (lazy import)
- `SettingsPanel.js` ✅ (lazy import)

**Layout 컴포넌트 (4개)**
- `Layout.jsx` ✅
- `Header.jsx` ✅
- `Footer.jsx` ✅
- `Sidebar.jsx` ✅

**Auth 컴포넌트 (2개)**
- `LoginForm.jsx` ✅
- `SignupForm.jsx` ✅

#### 🔄 **향후 확장 준비된 폴더들**
- `templates/` - 기본 구조 정의
- `subscription/` - 기본 구조 정의
- `coaching/` - 기본 구조 정의
- `gamification/` - 기본 구조 정의

### **📁 Context 레이어 (4개 Context)**

#### `TextContext.js` ⭐ **핵심 Context**
```javascript
제공 상태:
├── text (현재 텍스트)
├── purpose (글의 목적)
├── options (최적화 옵션)
└── 관련 setter 함수들

사용처:
├── EditorPage.jsx (메인 사용)
├── ComparisonView.js
├── ResultsPage.js
└── AnalysisIndicators.js
```

#### `UserContext.js`
```javascript
제공 상태:
├── user (사용자 정보)
├── isLoggedIn (로그인 상태)
└── 인증 관련 함수들

사용처:
├── ProfilePage.jsx
├── Header.jsx
└── SubscriptionPage.jsx
```

#### `AppContext.js`
```javascript
제공 상태:
├── theme (테마 설정)
├── language (언어 설정)
└── 앱 전역 설정

사용처: Layout 및 전역 설정
```

#### `AnalyticsContext.js`
```javascript
제공 상태:
├── analysisData (분석 결과)
├── history (분석 이력)
└── 통계 관련 함수들

사용처:
├── AnalysisPage.jsx
├── DashboardPage.jsx
└── ProfilePage.jsx
```

### **📁 Utils 레이어 (4개 파일)**

#### `api.js`
```javascript
제공 함수:
├── apiRequest (기본 API 호출)
└── useApiRequest (React Hook)

사용처: 모든 API 호출이 필요한 컴포넌트
```

#### `storage.js`
```javascript
제공 함수:
├── saveUser, getUser, removeUser
├── saveSettings, getSettings
└── saveCache, getCache, clearCache

사용처: Context 및 데이터 지속성 필요한 컴포넌트
```

#### `validation.js`
```javascript
제공 함수:
├── isValidEmail
├── isLengthInRange
└── isRequired

사용처: 폼 검증이 필요한 모든 컴포넌트
```

#### `errorHandler.js`
```javascript
제공 함수:
└── handleError (통합 에러 처리)

사용처: API 호출 및 에러 처리가 필요한 컴포넌트
```

---

## 📊 **3. 데이터 흐름 분석**

### **텍스트 최적화 플로우**
```
사용자 입력 (EditorPage) 
→ TextContext 상태 업데이트 
→ API 호출 (api.js) 
→ 결과 저장 (storage.js) 
→ 결과 표시 (ResultsPage/AnalysisPage)
```

### **인증 플로우**
```
로그인 (LoginForm) 
→ UserContext 상태 업데이트 
→ 로컬 저장소 저장 (storage.js) 
→ UI 업데이트 (Header, 전체 앱)
```

### **분석 데이터 플로우**
```
텍스트 분석 완료 
→ AnalyticsContext 업데이트 
→ 차트/그래프 렌더링 (AnalysisChart) 
→ 비교 뷰 업데이트 (ComparisonView)
```

---

## 🎯 **4. 핵심 연결점 및 의존성**

### **가장 중요한 연결점**
1. **EditorPage ↔ TextContext**: 텍스트 편집의 중심
2. **App.js ↔ 모든 Context**: 전역 상태 관리
3. **Layout ↔ 모든 페이지**: 공통 UI 구조
4. **api.js ↔ 모든 데이터 호출**: API 통신 중심

### **의존성 흐름**
```
Pages → Components → Contexts → Utils
  ↓        ↓          ↓        ↓
 UI 로직  재사용 UI   상태관리  핵심로직
```

---

## 🗂️ **5. 모듈 구조 (Index 파일들)**

### **완성된 Index 파일들**
- `src/components/index.js` - 모든 컴포넌트 재export
- `src/components/common/index.js` - 공통 컴포넌트들
- `src/components/analytics/index.js` - 분석 컴포넌트들
- `src/components/editor/index.js` - 에디터 컴포넌트들
- `src/contexts/index.js` - 모든 Context들
- `src/utils/index.js` - 유틸리티 함수들
- `src/types/index.js` - 타입 정의들

### **향후 확장 준비된 Index 파일들**
- `src/components/templates/index.js`
- `src/components/subscription/index.js`
- `src/components/coaching/index.js`
- `src/components/gamification/index.js`

---

## ✅ **6. 구현 완성 현황**

### **완료된 작업들**
- ✅ **11개 페이지 모두 구현 완료**
- ✅ **핵심 컴포넌트들 구현 완료**
- ✅ **Context 시스템 안정화**
- ✅ **라우팅 구조 완성**
- ✅ **Index 파일들 정리**
- ✅ **미사용 파일 제거** (EditorPane.js 등)
- ✅ **빌드 성공 확인**

### **향후 확장 포인트**
- 🔄 템플릿 관련 컴포넌트들
- 🔄 구독/결제 관련 세부 컴포넌트들
- 🔄 코칭 시스템 상세 구현
- 🔄 게임화 요소들

---

## 🚀 **7. 성능 및 최적화** ⭐ **2025.06.21 대폭 개선**

### **번들 최적화 현황**
- **최적화 전**: 447KB → **최적화 후**: 438KB (-2% 감소)
- **Heroicons 최적화**: 331KB → 4.11KB (-98.7% 대폭 감소)
- **청크 분할**: 단일 번들 → 12개 청크로 분할
- **초기 로딩**: 라우트별 지연 로딩으로 성능 개선

### **적용된 최적화 기법**

#### **1. 코드 스플리팅 (Code Splitting)**
```javascript
// React.lazy를 통한 페이지별 분할
const HomePage = React.lazy(() => import('./pages/HomePage'));
const EditorPage = React.lazy(() => import('./pages/EditorPage'));
// ... 11개 페이지 모두 적용
```

#### **2. 동적 Import (Dynamic Import)**
```javascript
// 컴포넌트별 지연 로딩
export const AnalysisChart = lazy(() => import('./AnalysisChart'));
export const TextEditor = lazy(() => import('./TextEditor'));
```

#### **3. 트리 셰이킹 (Tree Shaking)**
```javascript
// 개별 heroicons import로 최적화
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
// 331KB → 4.11KB 대폭 감소
```

#### **4. Webpack 최적화**
- **청크 분할**: vendor, react, common 청크 분리
- **캐싱**: contenthash를 통한 브라우저 캐싱 최적화
- **압축**: production 빌드 시 aggressive merging 적용

#### **5. Babel 최적화**
- **Runtime 최적화**: @babel/plugin-transform-runtime 적용
- **Polyfill 최적화**: useBuiltIns: 'entry' 설정
- **캐싱**: babel-loader 캐시 활성화

### **성능 지표**
- **빌드 시간**: ~7초 (안정적)
- **청크 개수**: 12개 (적절한 분할)
- **최대 청크 크기**: 240KB (vendor 청크)
- **초기 앱 청크**: 28.2KB (매우 경량)

### **최적화 완료 사항**
- ✅ **라우트 기반 코드 스플리팅** (2025.06.21)
- ✅ **컴포넌트 동적 import** (2025.06.21)
- ✅ **Heroicons 트리 셰이킹** (2025.06.21)
- ✅ **Webpack 청크 최적화** (2025.06.21)
- ✅ **Babel runtime 최적화** (2025.06.21)
- ✅ **Suspense fallback 구현** (2025.06.21)
- ✅ 불필요한 의존성 제거
- ✅ 사용되지 않는 파일 정리
- ✅ 번들 크기 모니터링

### **향후 최적화 계획**
- 🔄 Core-js 최적화 (예상 -200KB)
- 🔄 CSS 최적화 (예상 -15KB)
- 🔄 이미지 최적화 (예상 -20KB)
- 🔄 Gzip/Brotli 압축 (예상 실제 전송 크기 120KB)

---

## ⚙️ **8. 설정 파일 최적화** ⭐ **2025.06.21 업데이트**

### **Webpack 설정 (webpack.config.js)**
```javascript
// 주요 최적화 설정
optimization: {
  splitChunks: {
    chunks: 'all',
    maxSize: 244000,
    cacheGroups: {
      vendor: { /* vendor 청크 분리 */ },
      react: { /* React 청크 분리 */ },
      common: { /* 공통 청크 */ }
    }
  },
  runtimeChunk: { name: 'runtime' },
  usedExports: true,
  sideEffects: false
}
```

### **Babel 설정 (babel.config.json)**
```javascript
// 성능 최적화 설정
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "entry",
      "corejs": 3,
      "modules": false
    }]
  ],
  "plugins": [
    ["@babel/plugin-transform-runtime", { /* runtime 최적화 */ }]
  ]
}
```

### **Package.json 최적화**
```javascript
// 트리 셰이킹을 위한 설정
"sideEffects": [
  "*.css",
  "src/index.js",
  "src/index.css"
]
```

### **새로운 스크립트**
- `build:analyze`: 번들 분석 도구 실행
- `build:stats`: webpack stats 파일 생성

---

## 📝 **9. 개발 가이드라인**

### **새 컴포넌트 추가 시**
1. 적절한 폴더에 컴포넌트 생성
2. 해당 폴더의 `index.js`에 export 추가
3. PropTypes 정의 필수
4. 이 가이드 문서 업데이트

### **새 페이지 추가 시**
1. `src/pages/`에 페이지 생성
2. `App.js`에 라우트 추가
3. 필요한 Context 연결
4. 공통 레이아웃 사용

### **상태 관리 시**
1. 전역 상태: Context 사용
2. 로컬 상태: useState 사용
3. 서버 상태: API + Context 조합
4. 캐싱: storage.js 활용

---

## 🚨 **개발 시 주의사항 및 오류 방지 가이드라인**

### **React 컴포넌트 개발 시 주의사항**

#### 1. **React.lazy 사용 규칙**
```javascript
// ❌ 잘못된 사용 - named export로 lazy 컴포넌트 export
export const Component = lazy(() => import('./Component'));

// ✅ 올바른 사용 - 일반 export 또는 직접 lazy 사용
export { default as Component } from './Component';
// 또는
const Component = React.lazy(() => import('./Component'));
```

#### 2. **Props 방어적 코딩**
```javascript
// ❌ 위험한 코드 - undefined 접근 가능
const Component = ({ options }) => {
  return <div>{options.formality}</div>;
};

// ✅ 안전한 코드 - 기본값 설정
const Component = ({ options = {} }) => {
  const safeOptions = { formality: 50, ...options };
  return <div>{safeOptions.formality}</div>;
};
```

#### 3. **파일 중복 방지**
- 같은 디렉토리에 동일한 이름의 .js/.jsx 파일 금지
- 파일 삭제 시 모든 import 경로 확인 필수
- webpack resolve.extensions 순서 고려

### **빌드 및 배포 시 주의사항**

#### 1. **React Refresh 설정**
- webpack.config.js에서 NODE_ENV 명시적 설정
- babel.config.json 환경별 설정 사용
- 프로덕션 빌드 후 `findstr /C:"RefreshSig" dist\*.js` 확인

#### 2. **PublicPath 설정**
```javascript
// 커스텀 도메인 사용 시
const publicPath = '/';

// GitHub Pages 서브디렉토리 사용 시  
const publicPath = '/repository-name/';
```

#### 3. **Import 최적화**
```javascript
// ❌ 전체 패키지 import (큰 번들 크기)
import { Icon1, Icon2 } from '@heroicons/react/24/outline';

// ✅ 개별 import (트리 셰이킹 가능)
import Icon1 from '@heroicons/react/24/outline/Icon1';
import Icon2 from '@heroicons/react/24/outline/Icon2';
```

### **Context 사용 시 주의사항**

#### 1. **Context Provider 순서**
```javascript
// Context Provider는 의존성 순서대로 배치
<AppProvider>
  <UserProvider>
    <AnalyticsProvider>
      <TextContextProvider>
        {children}
      </TextContextProvider>
    </AnalyticsProvider>
  </UserProvider>
</AppProvider>
```

#### 2. **Context 값 검증**
```javascript
export const useTextContext = () => {
  const context = useContext(TextContext);
  if (context === undefined) {
    throw new Error('useTextContext must be used within a TextContextProvider');
  }
  return context;
};
```

---

이 가이드는 TextPerfect 프로젝트의 **완전한 구조 맵**입니다. 모든 파일이 어떻게 연결되어 있는지, 어떤 역할을 하는지 명확하게 파악할 수 있으며, 향후 확장과 유지보수에 필수적인 참고 자료입니다. 