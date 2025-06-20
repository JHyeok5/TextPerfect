# TextPerfect 오류 방지 가이드

> **최종 업데이트**: 2025년 6월 21일  
> **목적**: TextPerfect 프로젝트에서 발생한 주요 오류들과 예방 방법 정리  
> **중요도**: ⭐⭐⭐⭐⭐ (필수 숙지)

## 📋 문서 개요

이 가이드는 TextPerfect 프로젝트 개발 중 실제로 발생한 오류들을 분석하고, 동일한 문제가 재발하지 않도록 예방 방법을 제시합니다.

---

## 🚨 주요 오류 사례 및 해결책

### 1. React Refresh 프로덕션 빌드 오류

#### **오류 증상**
```
Uncaught ReferenceError: $RefreshSig$ is not defined
```

#### **발생 원인**
- 개발용 React Refresh 코드가 프로덕션 빌드에 포함됨
- webpack.config.js와 babel.config.json 설정 충돌

#### **해결 방법**
```javascript
// webpack.config.js - 올바른 설정
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  process.env.NODE_ENV = isProduction ? 'production' : 'development';
  
  return {
    // babel-loader에서 플러그인 직접 추가 금지
    // babel.config.json의 환경별 설정 사용
  };
};

// babel.config.json - 환경별 설정
{
  "env": {
    "development": {
      "plugins": ["react-refresh/babel"]
    },
    "production": {
      "plugins": []
    }
  }
}
```

#### **예방 체크리스트**
- [ ] NODE_ENV 명시적 설정 확인
- [ ] babel.config.json 환경별 설정 사용
- [ ] 프로덕션 빌드 후 `findstr /C:"RefreshSig" dist\*.js` 실행
- [ ] ReactRefreshWebpackPlugin은 개발 환경에서만 사용

---

### 2. React.lazy Named Export 오류

#### **오류 증상**
```
Minified React error #426
Error: Lazy component's module should have a default export
```

#### **발생 원인**
- React.lazy는 default export만 지원하는데 named export로 사용
- `export const Component = lazy(() => import('./Component'))` 형태 사용

#### **해결 방법**
```javascript
// ❌ 잘못된 방법
export const TextEditor = lazy(() => import('./TextEditor'));

// ✅ 올바른 방법 1 - 일반 export 사용
export { default as TextEditor } from './TextEditor';

// ✅ 올바른 방법 2 - 사용하는 곳에서 직접 lazy 사용
const TextEditor = React.lazy(() => import('./components/TextEditor'));
```

#### **예방 체크리스트**
- [ ] React.lazy는 default export된 컴포넌트만 사용
- [ ] index.js에서 lazy export 사용 금지
- [ ] 컴포넌트별 lazy loading 필요 시 사용하는 곳에서 직접 구현
- [ ] Suspense와 ErrorBoundary 적절히 배치

---

### 3. Props Undefined 접근 오류

#### **오류 증상**
```
TypeError: Cannot read properties of undefined (reading 'formality')
```

#### **발생 원인**
- 컴포넌트에서 props 객체가 undefined일 때 속성에 직접 접근
- 방어적 코딩 부재

#### **해결 방법**
```javascript
// ❌ 위험한 방법
const SettingsPanel = ({ options }) => {
  return <div>{options.formality}</div>; // options가 undefined면 오류
};

// ✅ 안전한 방법
const SettingsPanel = ({ options = {} }) => {
  const safeOptions = {
    formality: 50,
    conciseness: 50,
    terminology: 'basic',
    ...options
  };
  return <div>{safeOptions.formality}</div>;
};
```

#### **예방 체크리스트**
- [ ] 모든 객체 props에 기본값 설정
- [ ] PropTypes에서 required 속성 신중하게 설정
- [ ] Context에서 가져온 값도 undefined 가능성 고려
- [ ] 깊은 객체 접근 시 optional chaining 사용

---

### 4. 파일 중복 및 Import 충돌

#### **오류 증상**
- Module resolution 오류
- 예상과 다른 컴포넌트 로딩
- 빌드 시 ambiguous module 경고

#### **발생 원인**
- 같은 이름의 파일이 여러 개 존재 (EditorPage.js, EditorPage.jsx)
- webpack이 어떤 파일을 import할지 모호함

#### **해결 방법**
```javascript
// 파일 구조 정리
src/pages/
├── EditorPage.jsx        // ✅ 하나만 유지
└── EditorPage/
    └── EditorSidebar.jsx

// import 경로 명시적 작성
import EditorPage from './pages/EditorPage.jsx'; // 확장자 명시
```

#### **예방 체크리스트**
- [ ] 같은 디렉토리에 동일한 이름의 .js/.jsx 파일 금지
- [ ] 파일 삭제 시 모든 import 경로 확인
- [ ] webpack resolve.extensions 순서 고려
- [ ] 파일명 컨벤션 일관성 유지

---

### 5. PublicPath 설정 오류

#### **오류 증상**
- 리소스 404 오류
- CSS, JS 파일 로드 실패
- 잘못된 경로 참조

#### **발생 원인**
- GitHub Pages 커스텀 도메인 사용 시 잘못된 publicPath 설정
- 서브디렉토리와 루트 도메인 설정 혼동

#### **해결 방법**
```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  // 커스텀 도메인 사용 시
  const publicPath = isProduction ? '/' : '/';
  
  // GitHub Pages 서브디렉토리 사용 시
  // const publicPath = isProduction ? '/repository-name/' : '/';
  
  return {
    output: {
      publicPath: publicPath,
      // ...
    }
  };
};
```

#### **예방 체크리스트**
- [ ] 배포 환경에 맞는 publicPath 설정
- [ ] CNAME 파일과 publicPath 설정 일치 확인
- [ ] 상대 경로 vs 절대 경로 신중하게 선택
- [ ] 배포 후 리소스 로드 확인

---

## 🛡️ 일반적인 예방 원칙

### 1. **방어적 프로그래밍**
```javascript
// 항상 기본값 설정
const Component = ({ data = {}, items = [] }) => {
  // 안전한 접근
  const safeData = { defaultValue: 'fallback', ...data };
  return <div>{safeData.value || safeData.defaultValue}</div>;
};
```

### 2. **타입 안전성**
```javascript
// PropTypes 적극 활용
Component.propTypes = {
  data: PropTypes.object,
  items: PropTypes.array,
  callback: PropTypes.func.isRequired
};
```

### 3. **환경별 설정 분리**
```javascript
// 환경별 설정 명확히 분리
const config = {
  development: { /* dev settings */ },
  production: { /* prod settings */ }
};
```

### 4. **빌드 검증**
```bash
# 빌드 후 필수 검증 명령어
npm run build
findstr /C:"RefreshSig" dist\*.js  # React Refresh 확인
findstr /C:"console.log" dist\*.js # 개발용 로그 확인
```

---

## 🔧 디버깅 도구 및 방법

### 1. **개발 환경 오류 확인**
```bash
# 개발 서버에서 상세 오류 확인
npm start
# 브라우저 개발자 도구 콘솔에서 상세 오류 메시지 확인
```

### 2. **프로덕션 빌드 검증**
```bash
# 프로덕션 빌드 생성
npm run build

# 번들 분석
npm run build:analyze

# 정적 서버로 테스트
npx serve dist
```

### 3. **의존성 검사**
```bash
# 사용하지 않는 의존성 확인
npm run check-deps

# 보안 취약점 확인
npm audit
```

---

## 📚 참고 자료

### React 관련
- [React.lazy 공식 문서](https://reactjs.org/docs/code-splitting.html#reactlazy)
- [React Error Boundaries](https://reactjs.org/docs/error-boundaries.html)

### Webpack 관련
- [Webpack Code Splitting](https://webpack.js.org/guides/code-splitting/)
- [Webpack PublicPath](https://webpack.js.org/guides/public-path/)

### 번들 최적화
- [Tree Shaking](https://webpack.js.org/guides/tree-shaking/)
- [Bundle Analysis](https://webpack.js.org/guides/code-splitting/#bundle-analysis)

---

## ⚠️ 중요 알림

이 가이드에 명시된 오류들은 실제 프로젝트에서 발생한 사례들입니다. 
새로운 기능 개발 시 반드시 이 가이드를 참조하여 동일한 문제가 재발하지 않도록 주의하세요.

**문제 발생 시 행동 지침:**
1. 개발 환경에서 상세 오류 메시지 확인
2. 이 가이드에서 유사 사례 검색
3. 해결 후 가이드 업데이트
4. 팀원들과 공유 