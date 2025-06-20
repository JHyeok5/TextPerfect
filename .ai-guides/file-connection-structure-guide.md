# TextPerfect 파일 연결 구조 및 의존성 매핑 가이드

## 📋 **문서 개요**

이 문서는 TextPerfect 프로젝트의 모든 파일들이 서로 어떻게 연결되어 있는지, 의존성 관계와 데이터 흐름을 상세히 매핑한 종합 가이드입니다.

---

## 🏗️ **1. 전체 아키텍처 구조**

### **진입점 및 핵심 흐름**
```
index.js → App.js → Context Providers → Layout → Pages → Components
```

### **레이어별 구조**
1. **Entry Layer**: `index.js` (React 앱 마운트)
2. **App Layer**: `App.js` (라우팅, Context, ErrorBoundary)
3. **Context Layer**: 전역 상태 관리 (User, App, Analytics, Text)
4. **Layout Layer**: 공통 레이아웃 (Header, Sidebar, Footer)
5. **Page Layer**: 라우트별 페이지 컴포넌트
6. **Component Layer**: 재사용 가능한 UI 컴포넌트
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

역할: React 앱의 진입점, 루트 렌더링
```

#### `src/App.js`
```javascript
의존성:
├── React (Routes, Route)
├── ./contexts/* (4개 Provider)
├── ./components/layout/Layout
├── ./pages/* (7개 페이지)
└── ./components/common/UsageLimitModal

역할: 
- 전역 Context Provider 설정
- 라우팅 구성
- ErrorBoundary 제공
```

---

### **📁 Context Layer (상태 관리)**

#### `src/contexts/AppContext.js`
```javascript
제공하는 상태:
├── ui (loading, modal, notification)
├── navigation (currentPage, history)
└── messages (error, success)

사용하는 컴포넌트: 전역적으로 사용 가능
```

#### `src/contexts/UserContext.js`
```javascript
의존성:
├── React (createContext, useState, useEffect)
└── ../utils/storage (사용자 정보 저장)

제공하는 상태:
├── user (사용자 정보)
├── login/logout 함수
└── 인증 상태

사용하는 컴포넌트:
├── Header.jsx (로그인 상태 표시)
├── DashboardPage.jsx (사용자 정보)
└── LoginForm.jsx (로그인 처리)
```

#### `src/contexts/TextContext.js`
```javascript
제공하는 상태:
├── text (입력 텍스트)
├── purpose (목적)
└── options (최적화 옵션)

사용하는 컴포넌트:
├── EditorPage.jsx (메인 에디터)
└── ResultsPage.js (결과 표시)
```

#### `src/contexts/AnalyticsContext.js`
```javascript
제공하는 상태:
└── analytics (분석 데이터)

사용하는 컴포넌트:
└── AnalysisPage.jsx (분석 결과)
```

---

### **📁 Layout Layer (레이아웃)**

#### `src/components/layout/Layout.jsx`
```javascript
의존성:
├── ./Header.jsx
├── ./Sidebar.jsx
└── ./Footer.jsx

역할: 전체 페이지 레이아웃 구성
사용하는 곳: App.js에서 모든 페이지를 감쌈
```

#### `src/components/layout/Header.jsx`
```javascript
의존성:
├── react-router-dom (Link, NavLink)
├── ../../contexts/UserContext (useUser)
├── ../common/ProgressBar
├── ../common/Button
├── ../common/Modal
├── ../auth/LoginForm
└── ../auth/SignupForm

역할: 네비게이션, 로그인 상태, 사용량 표시
```

#### `src/components/layout/Sidebar.jsx`
```javascript
의존성:
├── react-router-dom (useLocation)
└── ../../pages/EditorPage/EditorSidebar

역할: 페이지별 동적 사이드바 표시
현재 구성: /editor 경로에서만 EditorSidebar 표시
```

#### `src/components/layout/Footer.jsx`
```javascript
의존성: 없음
역할: 푸터 정보 표시
```

---

### **📁 Page Layer (페이지)**

#### `src/pages/EditorPage.jsx` ⭐ **핵심 페이지**
```javascript
의존성:
├── React (useState)
├── react-toastify (toast)
├── ../components/editor/TextEditor
├── ../components/common/Button
├── ../components/editor/AnalysisIndicators
├── ./EditorPage/EditorSidebar
├── ../utils/api (apiRequest)
├── ../constants (API_ENDPOINTS)
├── ../components/common/LoadingSpinner
└── ../contexts/TextContext (useTextContext)

연결된 컴포넌트:
├── EditorSidebar (설정 패널)
├── TextEditor (텍스트 입력)
├── AnalysisIndicators (분석 결과)
├── Button (최적화 버튼)
└── LoadingSpinner (로딩 상태)

데이터 흐름:
TextContext ↔ EditorPage ↔ 자식 컴포넌트들
```

#### `src/pages/DashboardPage.jsx`
```javascript
의존성:
├── react-router-dom (Link)
├── ../contexts/UserContext (useUser)
├── ../components/common/Button
└── @heroicons/react/24/outline

역할: 메인 대시보드, 사용자 현황 표시
```

#### `src/pages/AnalysisPage.jsx`
```javascript
의존성: React만
역할: 분석 페이지 (향후 확장 예정)
```

#### `src/pages/TemplatesPage.jsx`
```javascript
의존성: React만
역할: 템플릿 페이지 (향후 확장 예정)
```

#### `src/pages/CoachingPage.jsx`
```javascript
의존성: React만
역할: 코칭 페이지 (향후 확장 예정)
```

#### `src/pages/ProfilePage.jsx`
```javascript
의존성: React만
역할: 프로필 페이지 (향후 확장 예정)
```

#### `src/pages/SubscriptionPage.jsx`
```javascript
의존성: React만
역할: 구독 페이지 (향후 확장 예정)
```

#### `src/pages/EditorPage/EditorSidebar.jsx`
```javascript
의존성:
├── React
├── PropTypes
└── ../../components/editor/SettingsPanel

역할: EditorPage의 사이드바 (SettingsPanel 래핑)
```

---

### **📁 Component Layer (컴포넌트)**

#### **Editor 컴포넌트**

##### `src/components/editor/TextEditor.js`
```javascript
의존성:
├── React
└── PropTypes

Props:
├── value (string, required)
└── onChange (function, required)

역할: 텍스트 입력 영역
사용하는 곳: EditorPage.jsx
```

##### `src/components/editor/SettingsPanel.js`
```javascript
의존성:
├── React
└── PropTypes

Props:
├── purpose (string, required)
├── options (object, required)
├── onPurposeChange (function, required)
└── onOptionsChange (function, required)

역할: 최적화 설정 (목적, 격식도, 간결성, 전문용어)
사용하는 곳: EditorSidebar.jsx
```

##### `src/components/editor/AnalysisIndicators.js`
```javascript
의존성:
├── React
└── PropTypes

Props:
└── result (object, optional)

역할: AI 분석 결과 표시 (가독성, 전문성, 명확성)
사용하는 곳: EditorPage.jsx
```

##### `src/components/editor/EditorPane.js`
```javascript
의존성:
├── React
├── PropTypes
└── ../common/LoadingSpinner

Props:
├── text (string, required)
├── onChange (function, required)
├── isProcessing (boolean, required)
├── error (string, optional)
└── onOptimize (function, required)

역할: 에디터 패널 (현재 사용되지 않음)
```

#### **Common 컴포넌트**

##### `src/components/common/Button.jsx`
```javascript
의존성:
├── React
├── PropTypes
└── classnames

Props:
├── variant (string)
├── size (string)
├── disabled (boolean)
└── 기타 HTML button props

역할: 재사용 가능한 버튼 컴포넌트
사용하는 곳: Header, EditorPage, DashboardPage 등
```

##### `src/components/common/Modal.jsx`
```javascript
의존성:
├── React
├── PropTypes
└── classnames

Props:
├── isOpen (boolean, required)
├── onClose (function, required)
├── title (string)
└── children (node)

역할: 모달 다이얼로그
사용하는 곳: Header.jsx (로그인/회원가입)
```

##### `src/components/common/LoadingSpinner.jsx`
```javascript
의존성:
├── React
└── PropTypes

Props:
└── className (string)

역할: 로딩 스피너
사용하는 곳: EditorPage, EditorPane
```

##### `src/components/common/ProgressBar.jsx`
```javascript
의존성:
├── React
├── PropTypes
└── classnames

Props:
├── value (number, required)
├── max (number)
└── className (string)

역할: 진행률 표시 바
사용하는 곳: Header.jsx (사용량 표시)
```

##### `src/components/common/Card.jsx`
```javascript
의존성:
├── React
├── PropTypes
└── classnames

역할: 카드 레이아웃 컴포넌트
```

##### `src/components/common/Badge.jsx`
```javascript
의존성:
├── React
├── PropTypes
└── classnames

역할: 배지 컴포넌트
```

##### `src/components/common/UsageLimitModal.js`
```javascript
의존성: React만

역할: 사용량 제한 모달
사용하는 곳: App.js (전역)
```

#### **Auth 컴포넌트**

##### `src/components/auth/LoginForm.jsx`
```javascript
의존성:
├── React (useState)
├── ../../contexts/UserContext (useUser)
└── ../common/Button

역할: 로그인 폼
사용하는 곳: Header.jsx
```

##### `src/components/auth/SignupForm.jsx`
```javascript
의존성:
├── React (useState)
└── ../common/Button

역할: 회원가입 폼
사용하는 곳: Header.jsx
```

---

### **📁 Utils Layer (유틸리티)**

#### `src/utils/api.js`
```javascript
의존성:
├── React (useState, useCallback)
├── react-toastify (toast)
├── ./errorHandler
└── ../constants (API_ENDPOINTS)

제공하는 함수:
├── apiRequest (API 요청)
└── useApiRequest (커스텀 훅)

사용하는 곳: EditorPage.jsx
```

#### `src/utils/storage.js`
```javascript
의존성: 없음

제공하는 함수:
├── storage (localStorage 관리)
├── saveUser/getUser/removeUser
├── saveSettings/getSettings
└── saveCache/getCache/clearCache

사용하는 곳: UserContext.js
```

#### `src/utils/validation.js`
```javascript
의존성: 없음

제공하는 함수:
├── isValidEmail
├── isLengthInRange
└── isRequired

사용하는 곳: 폼 유효성 검사
```

#### `src/utils/errorHandler.js`
```javascript
의존성: 없음

제공하는 함수:
└── handleError (기본 에러 처리)

사용하는 곳: api.js
```

---

### **📁 Constants Layer (상수)**

#### `src/constants/index.js`
```javascript
제공하는 상수:
├── SUBSCRIPTION_PLANS (구독 플랜)
├── LEVELS (레벨 시스템)
├── ANALYSIS_CATEGORIES (분석 카테고리)
├── API_ENDPOINTS (API 엔드포인트)
└── STORAGE_KEYS (로컬스토리지 키)

사용하는 곳: 전역적으로 사용
```

#### `src/constants/themes.js`
```javascript
제공하는 상수:
├── COLORS (색상 팔레트)
├── COMPONENT_CLASSES (컴포넌트 클래스)
└── ANIMATION (애니메이션 설정)
```

#### `src/constants/design.js`
```javascript
제공하는 상수:
├── CLASSNAMES (CSS 클래스)
├── ANIMATION_DURATION (애니메이션 시간)
└── BREAKPOINTS (반응형 중단점)
```

---

### **📁 Hooks Layer (커스텀 훅)**

#### `src/hooks/useLocalStorage.js`
```javascript
의존성: React (useState, useEffect)

제공하는 훅:
└── useLocalStorage (로컬스토리지 상태 관리)

사용하는 곳: 향후 확장 예정
```

---

## 🔄 **3. 데이터 흐름 다이어그램**

### **텍스트 최적화 플로우**
```
1. 사용자 입력 → TextEditor
2. TextEditor → TextContext (상태 저장)
3. 설정 변경 → SettingsPanel → TextContext
4. 최적화 버튼 → EditorPage → API 호출
5. API 응답 → AnalysisIndicators (결과 표시)
6. 최적화된 텍스트 → TextContext → TextEditor
```

### **인증 플로우**
```
1. 로그인 버튼 → Header → Modal 열기
2. LoginForm → UserContext (로그인 처리)
3. UserContext → storage (사용자 정보 저장)
4. Header → 로그인 상태 업데이트
```

---

## 📦 **4. 모듈 Export/Import 구조**

### **Index 파일들의 역할**

#### `src/components/index.js`
```javascript
재export 구조:
├── ./common (Button, Modal, LoadingSpinner 등)
├── ./auth (LoginForm, SignupForm)
├── ./editor (TextEditor, SettingsPanel 등)
├── ./analytics (AnalysisChart, ComparisonView)
├── ./subscription
├── ./templates
├── ./coaching
└── ./gamification
```

#### `src/contexts/index.js`
```javascript
재export 구조:
└── TextContext (기본 export)
```

#### `src/utils/index.js`
```javascript
현재 비어있음 (향후 확장 예정)
```

---

## ⚠️ **5. 주의사항 및 개선점**

### **현재 이슈**
1. **미사용 컴포넌트**: `EditorPane.js`가 정의되어 있지만 사용되지 않음
2. **빈 페이지들**: Analysis, Templates, Coaching, Profile, Subscription 페이지가 빈 상태
3. **불완전한 Index 파일**: `utils/index.js`가 비어있음

### **개선 권장사항**
1. **컴포넌트 정리**: 미사용 컴포넌트 제거 또는 활용 방안 마련
2. **Index 파일 완성**: utils, hooks 폴더의 index.js 완성
3. **타입 정의**: types 폴더 활용하여 TypeScript 타입 정의 추가
4. **컴포넌트 문서화**: 각 컴포넌트의 Props와 사용법 문서화

---

## 🎯 **6. 핵심 연결 포인트**

### **가장 중요한 연결 관계**
1. **App.js ↔ Context Providers**: 전역 상태 관리의 핵심
2. **EditorPage ↔ TextContext**: 텍스트 에디터 기능의 핵심
3. **Layout ↔ Pages**: 전체 UI 구조의 핵심
4. **Header ↔ UserContext**: 인증 시스템의 핵심

### **확장 가능한 연결 포인트**
1. **Analytics Context**: 분석 기능 확장
2. **빈 페이지들**: 새로운 기능 추가
3. **Utils 모듈**: 공통 유틸리티 확장
4. **Types 정의**: TypeScript 타입 시스템 강화

---

이 가이드를 통해 TextPerfect 프로젝트의 전체 파일 연결 구조를 파악하고, 새로운 기능 개발이나 리팩토링 시 참고할 수 있습니다. 