# 개발 가이드 (B단계 완성)

## 개발 환경 설정
- Node.js 18 이상 권장
- 의존성 설치: `npm install`
- 개발 서버 실행: `npm start`
- 빌드: `npm run build`
- Netlify Functions: `netlify dev` (로컬 서버리스)
- **환경 변수 체크**: `npm run check-env`

## 필수 환경 변수 (B단계)
```bash
# Netlify 환경 변수 설정 필요
CLAUDE_API_KEY=your_claude_api_key_here
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

## 코딩 컨벤션
- **스타일**: Prettier, ESLint, TailwindCSS
- **네이밍**: camelCase(함수/변수), PascalCase(컴포넌트), UPPER_SNAKE_CASE(상수)
- **주석**: JSDoc, 함수/컴포넌트 설명 필수
- **폴더/파일**: 기능별/역할별로 분리, index.js로 export 정리
- **테스트**: 주요 로직/유틸 함수는 단위 테스트 권장
- **사용자 제한**: 모든 기능에 사용자 유형별 제한 로직 필수 적용

## Git 브랜치 전략
- `main`: 배포/운영용(항상 안정 상태 유지)
- `dev`: 통합 개발(기능 병합 전 테스트)
- `feature/이름`: 기능별 개발 브랜치
- PR(Merge Request) 시 코드리뷰 필수
- 커밋 메시지: [타입] 간결한 설명 (예: [feat] 구독 결제 기능 추가)

## B단계 완성 체크리스트
- [x] Claude API Functions 구현 (사용자 유형별 차별화)
- [x] 월 문서 수 추적 시스템
- [x] 사용자 유형별 UI 제한
- [x] 템플릿 페이지 프리미엄 제한
- [x] AI 코치 페이지 차별화
- [x] 환경 변수 관리 시스템
- [ ] Netlify 환경 변수 설정
- [ ] 실제 Claude API 테스트 