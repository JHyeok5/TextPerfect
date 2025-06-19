# TextPerfect 브랜치 구조 가이드

이 문서는 TextPerfect 프로젝트의 GitHub Pages 배포를 위한 브랜치별 필수 파일 구조를 정의합니다.

## main 브랜치 구조

main 브랜치는 프로젝트의 개발 소스코드를 관리하는 주 브랜치입니다.

### 필수 파일 및 디렉토리

```
TextPerfect/
├── .gitignore               # Git 무시 파일 설정
├── package.json            # 프로젝트 의존성 및 스크립트 정의
├── package-lock.json       # 의존성 버전 고정
├── README.md               # 프로젝트 문서
├── netlify.toml            # Netlify 설정
├── postcss.config.js       # PostCSS 설정
├── tailwind.config.js      # Tailwind CSS 설정
├── public/                 # 정적 파일 디렉토리
│   ├── index.html         # 메인 HTML 파일
│   ├── manifest.json      # PWA 매니페스트
│   ├── CNAME             # 커스텀 도메인 설정
│   └── 404.html          # 404 에러 페이지
├── src/                    # 소스코드 디렉토리
│   ├── components/        # React 컴포넌트
│   ├── pages/            # 페이지 컴포넌트
│   ├── contexts/         # React Context
│   ├── hooks/            # Custom Hooks
│   ├── utils/            # 유틸리티 함수
│   ├── constants/        # 상수 정의
│   ├── types/            # TypeScript 타입 정의
│   ├── styles/           # 스타일 파일
│   ├── assets/          # 이미지 등 정적 자산
│   ├── App.js           # 루트 App 컴포넌트
│   ├── index.js         # 진입점
│   └── index.css        # 글로벌 스타일
└── .ai-guides/            # AI 가이드 문서
    └── branch-structure-guide.md  # 본 가이드 문서

```

### 주요 카테고리 설명

1. **설정 파일**
   - 프로젝트 구성, 빌드, 배포 관련 설정 파일들
   - 예: package.json, netlify.toml, postcss.config.js 등

2. **소스코드**
   - React 컴포넌트, 페이지, 유틸리티 등 실제 애플리케이션 코드
   - src/ 디렉토리 하위의 모든 개발 소스

3. **정적 자산**
   - 이미지, 폰트 등 정적 파일
   - public/ 디렉토리의 정적 파일들

4. **문서**
   - 프로젝트 문서, 가이드라인
   - README.md, .ai-guides/ 등

## gh-pages 브랜치 구조

gh-pages 브랜치는 빌드된 정적 파일만을 포함하며, GitHub Pages를 통해 배포됩니다.

### 필수 파일 및 디렉토리

```
TextPerfect/
├── index.html              # 메인 HTML 파일
├── manifest.json           # PWA 매니페스트
├── CNAME                  # 커스텀 도메인 설정 (필요시)
├── 404.html               # 404 에러 페이지
├── static/                # 빌드된 정적 파일
│   ├── css/              # 컴파일된 CSS
│   ├── js/               # 컴파일된 JavaScript
│   └── media/            # 최적화된 미디어 파일
└── asset-manifest.json    # 정적 자산 매핑
```

### 주요 카테고리 설명

1. **HTML 파일**
   - index.html: 메인 진입점
   - 404.html: 에러 페이지

2. **정적 자산**
   - 빌드/최적화된 JS, CSS 파일
   - 최적화된 이미지 및 미디어 파일

3. **설정 파일**
   - manifest.json: PWA 설정
   - CNAME: 도메인 설정 (필요시)
   - asset-manifest.json: 자산 매핑

## 브랜치 관리 지침

1. **main 브랜치**
   - 모든 개발 작업은 main 브랜치 또는 feature 브랜치에서 수행
   - 소스코드 변경사항은 반드시 main 브랜치에 먼저 적용

2. **gh-pages 브랜치**
   - 직접적인 파일 수정 금지
   - main 브랜치의 빌드 결과물만 포함
   - 자동화된 배포 프로세스를 통해서만 업데이트

3. **배포 프로세스**
   - main 브랜치에서 `npm run build` 실행
   - 빌드된 파일을 gh-pages 브랜치에 배포
   - GitHub Actions를 통한 자동 배포 권장

## 주의사항

1. gh-pages 브랜치에는 소스코드나 개발 설정 파일을 포함하지 않습니다.
2. main 브랜치의 .gitignore에 build/ 또는 dist/ 디렉토리를 포함하여 빌드 결과물이 main 브랜치에 커밋되지 않도록 합니다.
3. 배포 자동화 설정 시 반드시 main 브랜치의 변경사항만 트리거하도록 합니다. 