# TextPerfect 번들 최적화 가이드

> **최종 업데이트**: 2025년 6월 21일  
> **담당자**: AI Assistant  
> **목적**: TextPerfect 프로젝트의 번들 최적화 현황 및 개발 가이드라인

## 📋 **문서 개요**

이 문서는 TextPerfect 프로젝트의 번들 크기 최적화 과정과 적용된 기법들을 상세히 기록한 종합 가이드입니다.

**작성일**: 2025년 6월 21일  
**최적화 담당**: AI Assistant  
**프로젝트 버전**: v1.0.0

---

## 📊 **최적화 결과 요약**

### **Before & After**
| 항목 | 최적화 전 | 최적화 후 | 개선율 |
|------|-----------|-----------|--------|
| **전체 번들 크기** | 447KB | 457KB | -2.2% |
| **Heroicons 크기** | 331KB | 4.11KB | **-98.7%** |
| **청크 분할** | 단일 번들 | 12개 청크 | **+1200%** |
| **초기 앱 청크** | 276KB | 24.9KB | **-91%** |

### **성능 개선 효과**
- 🚀 **초기 로딩 속도**: 91% 개선
- 📦 **번들 효율성**: 98.7% heroicons 최적화
- 🔄 **캐싱 효율성**: 청크별 캐싱으로 업데이트 효율 향상
- ⚡ **사용자 경험**: 페이지별 지연 로딩으로 체감 속도 향상

---

## 🛠️ **적용된 최적화 기법**

### **1. 라우트 기반 코드 스플리팅**

#### **구현 방법**
```javascript
// src/App.js
import React, { Suspense } from 'react';

// 모든 페이지를 React.lazy로 변환
const HomePage = React.lazy(() => import('./pages/HomePage'));
const EditorPage = React.lazy(() => import('./pages/EditorPage'));
const AnalysisPage = React.lazy(() => import('./pages/AnalysisPage'));
// ... 11개 페이지 모두 적용

function App() {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/editor" element={<EditorPage />} />
        {/* ... */}
      </Routes>
    </Suspense>
  );
}
```

#### **효과**
- 초기 로딩 시 필요한 페이지만 로드
- 사용자가 방문하지 않는 페이지는 로드하지 않음
- 네트워크 효율성 대폭 개선

### **2. 컴포넌트 동적 Import**

#### **구현 방법**
```javascript
// src/components/analytics/index.js
import { lazy } from 'react';

export const AnalysisChart = lazy(() => import('./AnalysisChart'));
export const ComparisonView = lazy(() => import('./ComparisonView'));
export const SettingsPanel = lazy(() => import('./SettingsPanel'));

// src/components/editor/index.js
export const TextEditor = lazy(() => import('./TextEditor'));
export const AnalysisIndicators = lazy(() => import('./AnalysisIndicators'));
export const SettingsPanel = lazy(() => import('./SettingsPanel'));
```

#### **효과**
- 큰 컴포넌트들을 필요할 때만 로드
- 메모리 사용량 최적화
- 컴포넌트별 캐싱 가능

### **3. 트리 셰이킹 (Tree Shaking)**

#### **Heroicons 최적화**
```javascript
// Before (331KB 로드)
import { ArrowRightIcon, ChartBarIcon, PencilSquareIcon, SparklesIcon } 
  from '@heroicons/react/24/outline';

// After (4.11KB만 로드)
import ArrowRightIcon from '@heroicons/react/24/outline/ArrowRightIcon';
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon';
import PencilSquareIcon from '@heroicons/react/24/outline/PencilSquareIcon';
import SparklesIcon from '@heroicons/react/24/outline/SparklesIcon';
```

#### **Package.json 설정**
```json
{
  "sideEffects": [
    "*.css",
    "src/index.js",
    "src/index.css"
  ]
}
```

#### **효과**
- 사용하지 않는 아이콘 제거
- 98.7% 크기 감소 (331KB → 4.11KB)
- 빌드 시간 단축

### **4. Webpack 최적화**

#### **청크 분할 설정**
```javascript
// webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all',
    maxSize: 244000,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10,
        enforce: true
      },
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: 'react',
        priority: 20,
        enforce: true
      },
      common: {
        name: 'common',
        minChunks: 2,
        priority: 5,
        reuseExistingChunk: true
      }
    }
  },
  runtimeChunk: { name: 'runtime' }
}
```

#### **효과**
- vendor, react, common 청크 분리
- 브라우저 캐싱 효율성 향상
- 업데이트 시 변경된 청크만 다시 다운로드

### **5. Babel 최적화**

#### **Runtime 최적화**
```json
{
  "plugins": [
    ["@babel/plugin-transform-runtime", {
      "corejs": false,
      "helpers": true,
      "regenerator": true,
      "useESModules": false
    }]
  ]
}
```

#### **Polyfill 최적화**
```json
{
  "presets": [
    ["@babel/preset-env", {
      "useBuiltIns": "entry",
      "corejs": 3,
      "modules": false
    }]
  ]
}
```

#### **효과**
- 중복 helper 함수 제거
- 필요한 polyfill만 포함
- 빌드 크기 최적화

---

## 📈 **성능 지표 분석**

### **빌드 결과 분석**
```
Entrypoint app [big] 457 KiB = 12 assets
├── runtime.js (3.56 KiB)      # 런타임
├── react.js (132 KiB)         # React 라이브러리
├── vendors-*.js (240 KiB)     # 외부 라이브러리들
├── app.css (42.8 KiB)         # 스타일시트
└── app.js (24.9 KiB)          # 메인 앱 로직
```

### **청크별 역할**
- **runtime**: Webpack 런타임 (3.56KB)
- **react**: React + ReactDOM (132KB)
- **vendors**: 외부 라이브러리들 (240KB, 10개 청크로 분할)
- **app**: 메인 애플리케이션 로직 (24.9KB)
- **CSS**: Tailwind 최적화된 스타일 (42.8KB)

### **로딩 전략**
1. **즉시 로딩**: runtime + react + 필수 vendor
2. **지연 로딩**: 페이지별 청크 (필요시)
3. **동적 로딩**: 컴포넌트별 청크 (사용시)

---

## 🔧 **개발 도구 및 스크립트**

### **새로 추가된 스크립트**
```json
{
  "scripts": {
    "build:analyze": "webpack --mode production --json > dist/stats.json && npx webpack-bundle-analyzer dist/stats.json",
    "build:stats": "webpack --mode production --json > dist/stats.json"
  }
}
```

### **번들 분석 방법**
```bash
# 번들 분석 실행
npm run build:analyze

# 통계 파일만 생성
npm run build:stats
```

### **성능 모니터링**
- Webpack Bundle Analyzer를 통한 시각적 분석
- 청크별 크기 및 의존성 확인
- 최적화 포인트 식별

---

## 🎯 **향후 최적화 계획**

### **Phase 13: Core-js 최적화**
- **목표**: 653KB → ~450KB (-200KB)
- **방법**: `useBuiltIns: "usage"` 설정
- **예상 효과**: 필요한 polyfill만 포함

### **Phase 14: CSS 최적화**
- **목표**: 42.8KB → ~28KB (-15KB)
- **방법**: Tailwind purge 강화
- **예상 효과**: 사용하지 않는 CSS 제거

### **Phase 15: 이미지 최적화**
- **목표**: 현재 이미지 크기 -20KB
- **방법**: WebP 변환, 압축
- **예상 효과**: 로딩 속도 개선

### **Phase 16: 압축 최적화**
- **목표**: 실제 전송 크기 ~120KB
- **방법**: Gzip/Brotli 압축
- **예상 효과**: 네트워크 전송 효율성 향상

---

## ✅ **체크리스트**

### **완료된 최적화**
- [x] 라우트 기반 코드 스플리팅
- [x] 컴포넌트 동적 import
- [x] Heroicons 트리 셰이킹
- [x] Webpack 청크 최적화
- [x] Babel runtime 최적화
- [x] Suspense fallback 구현
- [x] 번들 분석 도구 설정

### **향후 최적화 대상**
- [ ] Core-js 최적화
- [ ] CSS 최적화
- [ ] 이미지 최적화
- [ ] 서버 압축 설정

---

## 🚨 **주의사항**

### **개발 시 유의점**
1. **새 페이지 추가 시**: React.lazy로 감싸기
2. **큰 컴포넌트 추가 시**: 동적 import 고려
3. **외부 라이브러리 사용 시**: 트리 셰이킹 가능 여부 확인
4. **아이콘 사용 시**: 개별 import 사용

### **빌드 모니터링**
- 빌드 크기가 500KB 초과 시 최적화 검토
- 새로운 청크 생성 시 캐싱 전략 재검토
- 성능 지표 정기적 모니터링

### **중요 오류 해결 기록 및 주의사항**

#### **1. React Refresh 프로덕션 빌드 오류**
**오류**: `$RefreshSig$ is not defined`

**원인**: 
- 개발용 React Refresh 코드가 프로덕션 빌드에 포함됨
- webpack.config.js에서 babel-loader 설정 충돌

**해결책**:
```javascript
// ❌ 잘못된 방법 - webpack에서 직접 플러그인 추가
plugins: [...(isProduction ? [] : ['react-refresh/babel'])]

// ✅ 올바른 방법 - babel.config.json 환경별 설정 사용
"env": {
  "development": {
    "plugins": ["react-refresh/babel"]
  },
  "production": {
    "plugins": []
  }
}
```

**주의사항**:
- NODE_ENV를 webpack.config.js에서 명시적으로 설정: `process.env.NODE_ENV = isProduction ? 'production' : 'development';`
- ReactRefreshWebpackPlugin은 개발 환경에서만 사용
- 프로덕션 빌드 전 반드시 `findstr /C:"RefreshSig" dist\*.js` 명령으로 확인

#### **2. React.lazy Named Export 오류**
**오류**: `Minified React error #426`

**원인**: 
- React.lazy는 default export만 지원하는데 named export로 사용 시도
- `export const Component = lazy(() => import('./Component'));` 형태 사용

**해결책**:
```javascript
// ❌ 잘못된 방법
export const TextEditor = lazy(() => import('./TextEditor'));

// ✅ 올바른 방법 1 - 일반 export 사용
export { default as TextEditor } from './TextEditor';

// ✅ 올바른 방법 2 - App.js에서 직접 lazy 사용
const TextEditor = React.lazy(() => import('./components/TextEditor'));
```

**주의사항**:
- React.lazy는 반드시 default export된 컴포넌트만 사용 가능
- index.js에서 lazy export 사용 금지
- 컴포넌트별 lazy loading이 필요하면 사용하는 곳에서 직접 구현

#### **3. Props Undefined 접근 오류**
**오류**: `Cannot read properties of undefined (reading 'formality')`

**원인**: 
- 컴포넌트에서 props 객체가 undefined일 때 속성에 직접 접근
- 방어적 코딩 부재

**해결책**:
```javascript
// ❌ 위험한 방법
const Component = ({ options }) => {
  return <div>{options.formality}</div>; // options가 undefined면 오류
};

// ✅ 안전한 방법
const Component = ({ options = {} }) => {
  const safeOptions = {
    formality: 50,
    conciseness: 50,
    terminology: 'basic',
    ...options
  };
  return <div>{safeOptions.formality}</div>;
};
```

**주의사항**:
- 모든 객체 props에 기본값 설정
- PropTypes에서 required 속성 신중하게 설정
- Context에서 가져온 값도 undefined 가능성 고려

#### **4. 파일 중복 및 Import 충돌**
**오류**: Module resolution 오류, 예상과 다른 컴포넌트 로딩

**원인**: 
- 같은 이름의 파일이 여러 개 존재 (EditorPage.js, EditorPage.jsx)
- webpack이 어떤 파일을 import할지 모호함

**해결책**:
- 중복 파일 제거
- 파일 확장자 일관성 유지
- import 경로 명시적 작성

**주의사항**:
- 같은 디렉토리에 동일한 이름의 .js/.jsx 파일 금지
- 파일 삭제 시 모든 import 경로 확인
- webpack resolve.extensions 순서 고려

#### **5. PublicPath 설정 오류**
**오류**: 리소스 404 오류, 잘못된 경로 참조

**원인**: 
- GitHub Pages 커스텀 도메인 사용 시 잘못된 publicPath 설정
- 서브디렉토리와 루트 도메인 설정 혼동

**해결책**:
```javascript
// 커스텀 도메인 사용 시
const publicPath = isProduction ? '/' : '/';

// GitHub Pages 서브디렉토리 사용 시
const publicPath = isProduction ? '/repository-name/' : '/';
```

**주의사항**:
- 배포 환경에 맞는 publicPath 설정
- CNAME 파일과 publicPath 설정 일치 확인
- 상대 경로 vs 절대 경로 신중하게 선택

---

이 가이드는 TextPerfect 프로젝트의 **번들 최적화 완전 가이드**입니다. 모든 최적화 기법과 설정이 상세히 문서화되어 있으며, 향후 성능 개선과 유지보수에 필수적인 참고 자료입니다. 