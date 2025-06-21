# TextPerfect 인증 시스템 구현 가이드

## 📋 개요

TextPerfect 프로젝트의 완전한 사용자 인증 시스템 구현 가이드입니다. GitHub Repository를 데이터 저장소로 사용하는 자체 구현 방식을 채택했습니다.

## 🏗️ 시스템 아키텍처

```
Frontend (React) ↔ Netlify Functions ↔ GitHub Repository
                                    ↔ JWT Token (인증)
```

### 주요 구성 요소

1. **프론트엔드**: React 컴포넌트 + Context API
2. **백엔드**: Netlify Functions (서버리스)
3. **데이터베이스**: GitHub Private Repository (JSON 파일)
4. **인증**: JWT Token + bcrypt 비밀번호 해싱

## 📁 파일 구조

```
프로젝트/
├── .env                              # 환경 변수
├── netlify/functions/
│   ├── auth/                         # 인증 API 엔드포인트
│   │   ├── signup.js                 # 회원가입
│   │   ├── login.js                  # 로그인
│   │   ├── me.js                     # 사용자 정보 조회
│   │   └── logout.js                 # 로그아웃
│   └── utils/                        # 유틸리티 함수들
│       ├── github-storage.js         # GitHub 저장소 연동
│       ├── jwt.js                    # JWT 토큰 관리
│       ├── password.js               # 비밀번호 관리
│       └── validation.js             # 입력값 검증
└── src/
    ├── components/auth/              # 인증 UI 컴포넌트
    │   ├── LoginForm.jsx
    │   └── SignupForm.jsx
    ├── contexts/UserContext.js      # 사용자 상태 관리
    └── utils/api.js                  # API 호출 함수들
```

## 🔧 환경 설정

### 1. 환경 변수 (.env)

```env
# GitHub 저장소 설정
GITHUB_TOKEN=your-github-token-here
GITHUB_OWNER=your-github-username
GITHUB_REPO=textperfect-userdata

# JWT 설정
JWT_SECRET=textperfect-super-secret-jwt-key-2024-secure
JWT_EXPIRES_IN=7d

# 보안 설정
BCRYPT_ROUNDS=12
```

### 2. GitHub Repository 설정

1. Private Repository 생성: `textperfect-userdata`
2. Personal Access Token 발급 (repo 권한)
3. 초기 파일 구조:
   ```
   data/
   ├── users.json          # 사용자 정보
   ├── sessions.json       # 토큰 블랙리스트
   └── stats.json          # 사용자 통계
   ```

## 🚀 API 엔드포인트

### 회원가입
- **URL**: `POST /.netlify/functions/auth/signup`
- **Body**: `{ nickname, email, password, passwordConfirm }`
- **Response**: `{ success, data: { user, token }, message }`

### 로그인
- **URL**: `POST /.netlify/functions/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ success, data: { user, token }, message }`

### 사용자 정보 조회
- **URL**: `GET /.netlify/functions/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, data: { user }, message }`

### 로그아웃
- **URL**: `POST /.netlify/functions/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success, message }`

## 🔐 보안 기능

### 비밀번호 보안
- bcrypt 해싱 (12 rounds)
- 강도 검증 (대소문자, 숫자, 특수문자 포함)
- 일반적인 패턴 차단

### JWT 토큰 보안
- 발급자 검증 (iss: 'textperfect')
- 토큰 블랙리스트 관리
- 만료 시간 설정 (기본 7일)

### 입력값 보안
- XSS 방지 (HTML 태그 제거)
- SQL 인젝션 방지
- 입력값 정제 및 검증

### API 보안
- Rate limiting
- CORS 설정
- 에러 메시지 정제

## 💾 데이터 구조

### 사용자 데이터 (users.json)
```json
{
  "users": [
    {
      "id": "uuid-v4",
      "email": "user@example.com",
      "nickname": "사용자닉네임",
      "passwordHash": "bcrypt-hashed-password",
      "level": 1,
      "exp": 0,
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLoginAt": "2024-01-01T00:00:00Z",
      "isActive": true,
      "subscription": {
        "plan": "FREE",
        "expiresAt": null,
        "usage": {
          "monthlyDocs": 0,
          "maxTextLength": 1000
        }
      }
    }
  ]
}
```

## 🎯 사용법

### 프론트엔드에서 API 호출

```javascript
import { signupUser, loginUser, getCurrentUser, logoutUser } from '../utils/api';

// 회원가입
const result = await signupUser({ nickname, email, password, passwordConfirm });

// 로그인
const result = await loginUser({ email, password });

// 현재 사용자 정보
const result = await getCurrentUser();

// 로그아웃
const result = await logoutUser();
```

### UserContext 사용

```javascript
import { useUser } from '../contexts/UserContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useUser();
  
  if (isAuthenticated) {
    return <div>환영합니다, {user.nickname}님!</div>;
  }
  
  return <div>로그인이 필요합니다.</div>;
}
```

## 🔄 인증 플로우

### 회원가입 플로우
1. 사용자가 회원가입 폼 작성
2. 프론트엔드에서 입력값 기본 검증
3. API 호출 (`/auth/signup`)
4. 서버에서 상세 검증 (이메일 중복, 비밀번호 강도)
5. 비밀번호 해싱 후 GitHub에 저장
6. JWT 토큰 생성 및 반환
7. 자동 로그인 처리

### 로그인 플로우
1. 사용자가 로그인 폼 작성
2. API 호출 (`/auth/login`)
3. 이메일로 사용자 조회
4. 비밀번호 검증
5. JWT 토큰 생성 및 반환
6. 로그인 상태 업데이트

### 자동 로그인 플로우
1. 앱 시작 시 localStorage에서 토큰 확인
2. 토큰이 있으면 `/auth/me` 호출
3. 토큰 유효성 검증
4. 사용자 정보 반환 및 상태 업데이트

## 🛠️ 트러블슈팅

### 일반적인 문제들

1. **GitHub API 403 에러**
   - Personal Access Token 권한 확인
   - Repository 접근 권한 확인

2. **JWT 토큰 에러**
   - JWT_SECRET 환경 변수 설정 확인
   - 토큰 만료 시간 확인

3. **CORS 에러**
   - Netlify Functions CORS 헤더 설정 확인
   - 프론트엔드 도메인 화이트리스트 확인

4. **비밀번호 해싱 에러**
   - bcryptjs 패키지 설치 확인
   - BCRYPT_ROUNDS 환경 변수 확인

## 📈 확장 가능성

### 향후 개선 사항
- 이메일 인증 기능
- 소셜 로그인 (Google, GitHub)
- 2FA (Two-Factor Authentication)
- 비밀번호 재설정
- 실제 데이터베이스 연동 (PostgreSQL, MongoDB)

### 성능 최적화
- 토큰 캐싱
- 사용자 데이터 캐싱
- API 응답 최적화

## 📝 참고 자료

- [JWT 공식 문서](https://jwt.io/)
- [bcrypt 라이브러리](https://github.com/dcodeIO/bcrypt.js)
- [GitHub API 문서](https://docs.github.com/en/rest)
- [Netlify Functions 가이드](https://docs.netlify.com/functions/overview/)

---

**마지막 업데이트**: 2024년 (인증 시스템 구현 완료) 