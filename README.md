# TextPerfect

TextPerfect는 Claude API를 활용하여 목적에 맞는 텍스트 최적화를 제공하는 웹 서비스입니다.

## 배포 URL

애플리케이션은 다음 URL에서 확인할 수 있습니다:
- 웹사이트: https://textperfect.space

## 주요 기능

- 목적별 텍스트 최적화 (학술, 비즈니스, 기술, 일반)
- 세부 설정을 통한 맞춤형 최적화 (형식성, 간결성, 용어 수준)
- 텍스트 변경 사항 비교 및 설명
- 텍스트 품질 분석 시각화

## 기술 스택

- **프론트엔드**: React, TailwindCSS, Chart.js
- **백엔드**: Netlify Functions (서버리스)
- **AI**: Claude API

## 개발 환경 설정

### 필수 요구 사항

- Node.js 16 이상
- npm 7 이상

### 설치 및 실행

1. 저장소 클론

```bash
git clone https://github.com/yourusername/textperfect.git
cd textperfect
```

2. 종속성 설치

```bash
npm install
```

3. 개발 서버 실행

```bash
npm start
```

4. Netlify Functions 로컬 개발 (optional)

```bash
npm run netlify-dev
```

## 배포

### GitHub Pages 배포

```bash
npm run build
```

GitHub Actions을 통해 자동 배포가 설정되어 있습니다. `main` 브랜치에 변경 사항을 푸시하면 자동으로 GitHub Pages에 배포됩니다.

### Netlify Functions 배포

Netlify에 프로젝트를 연결하고, 환경 변수를 설정하세요:

- `CLAUDE_API_KEY`: Anthropic의 Claude API 키

## 프로젝트 구조

```
textperfect/
├── netlify/
│   └── functions/       # 서버리스 함수
├── public/              # 정적 파일
├── src/
│   ├── assets/          # 이미지 등 에셋
│   ├── components/      # React 컴포넌트
│   ├── context/         # React Context
│   ├── pages/           # 페이지 컴포넌트
│   └── utils/           # 유틸리티 함수
├── .gitignore
├── netlify.toml         # Netlify 설정
├── package.json
├── README.md
└── tailwind.config.js   # TailwindCSS 설정
```

## 라이선스

MIT License 