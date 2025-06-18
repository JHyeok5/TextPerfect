# 개발 가이드

## 개발 환경 설정
- Node.js 18 이상 권장
- 의존성 설치: `npm install`
- 개발 서버 실행: `npm start`
- 빌드: `npm run build`
- Netlify Functions: `netlify dev` (로컬 서버리스)

## 코딩 컨벤션
- **스타일**: Prettier, ESLint, TailwindCSS
- **네이밍**: camelCase(함수/변수), PascalCase(컴포넌트), UPPER_SNAKE_CASE(상수)
- **주석**: JSDoc, 함수/컴포넌트 설명 필수
- **폴더/파일**: 기능별/역할별로 분리, index.js로 export 정리
- **테스트**: 주요 로직/유틸 함수는 단위 테스트 권장

## Git 브랜치 전략
- `main`: 배포/운영용(항상 안정 상태 유지)
- `dev`: 통합 개발(기능 병합 전 테스트)
- `feature/이름`: 기능별 개발 브랜치
- PR(Merge Request) 시 코드리뷰 필수
- 커밋 메시지: [타입] 간결한 설명 (예: [feat] 구독 결제 기능 추가) 