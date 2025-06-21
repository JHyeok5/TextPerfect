# TextPerfect 인증 시스템 구현 가이드

## 📋 개요

TextPerfect 프로젝트의 완전한 사용자 인증 시스템 구현 가이드입니다. GitHub Repository를 데이터 저장소로 사용하는 자체 구현 방식을 채택했습니다.

## 🏗️ 시스템 아키텍처

```
Frontend (React) ↔ Netlify Functions ↔ GitHub Repository (Private)
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
├── .env                              # 환경 변수 (로컬 개발용)
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
│       ├── validation.js             # 입력값 검증
│       └── response.js               # API 응답 헬퍼
└── src/
    ├── components/auth/              # 인증 UI 컴포넌트
    │   ├── LoginForm.jsx
    │   └── SignupForm.jsx
    ├── contexts/UserContext.js      # 사용자 상태 관리
    └── utils/api.js                  # API 호출 함수들
```

## 🔧 환경 설정

### 1. 환경 변수

**Netlify 환경변수 설정** (필수):
```env
# GitHub 저장소 설정
GITHUB_USERNAME=JHyeok5
GITHUB_REPO=TextPerfect-userdata
GITHUB_TOKEN=your-personal-access-token

# JWT 설정
JWT_SECRET=textperfect-secret-2024
JWT_EXPIRES_IN=7d

# 애플리케이션 설정
NODE_ENV=production
```

**로컬 개발용 .env 파일** (선택적):
```env
GITHUB_USERNAME=JHyeok5
GITHUB_REPO=TextPerfect-userdata
GITHUB_TOKEN=your-personal-access-token
JWT_SECRET=textperfect-secret-2024
JWT_EXPIRES_IN=7d
```

### 2. GitHub Repository 설정

1. **Private Repository 생성**: `TextPerfect-userdata`
2. **Personal Access Token 발급**: 
   - GitHub Settings → Developer settings → Personal access tokens
   - Scopes: `repo` (Full control of private repositories)
3. **초기 파일 구조** (자동 생성됨):
   ```
   TextPerfect-userdata/
   ├── users.json          # 사용자 정보
   ├── sessions.json       # 세션 및 토큰 블랙리스트
   └── stats.json          # 애플리케이션 통계
   ```

### 3. 필수 패키지

```bash
npm install bcryptjs jsonwebtoken uuid
```

## 🚀 API 엔드포인트

### 회원가입
- **URL**: `POST /.netlify/functions/auth/signup`
- **Body**: 
  ```json
  {
    "nickname": "사용자닉네임",
    "email": "user@example.com",
    "password": "SecurePass123!",
    "passwordConfirm": "SecurePass123!"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "...", "email": "...", "nickname": "..." },
      "token": "jwt-token",
      "expiresIn": "7d"
    },
    "message": "회원가입이 완료되었습니다."
  }
  ```

### 로그인
- **URL**: `POST /.netlify/functions/auth/login`
- **Body**: 
  ```json
  {
    "email": "user@example.com",
    "password": "SecurePass123!"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "...", "email": "...", "nickname": "..." },
      "token": "jwt-token",
      "expiresIn": "7d"
    },
    "message": "로그인이 완료되었습니다."
  }
  ```

### 사용자 정보 조회
- **URL**: `GET /.netlify/functions/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: 
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "user-id",
        "email": "user@example.com",
        "nickname": "사용자닉네임",
        "level": 1,
        "exp": 0,
        "subscription": { "plan": "FREE", ... }
      }
    }
  }
  ```

### 로그아웃
- **URL**: `POST /.netlify/functions/auth/logout`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: 
  ```json
  {
    "success": true,
    "message": "로그아웃되었습니다."
  }
  ```

## 🔐 보안 기능

### 비밀번호 보안
- **bcrypt 해싱** (12 rounds)
- **강도 검증**: 최소 8자, 대소문자, 숫자, 특수문자 포함
- **일반적인 패턴 차단**: password, 123456, qwerty 등
- **연속 문자 차단**: aaa, 123 등

### JWT 토큰 보안
- **발급자 검증** (iss: 'textperfect')
- **토큰 블랙리스트 관리**
- **만료 시간 설정** (기본 7일)
- **자동 만료 토큰 정리**

### 입력값 보안
- **XSS 방지**: HTML 태그 제거 및 이스케이프
- **SQL 인젝션 방지**: 입력값 정제
- **이메일 형식 검증**
- **닉네임 길이 및 형식 검증**

### API 보안
- **Rate limiting**: 분당 60회 제한
- **CORS 설정**: 안전한 크로스 오리진 요청
- **에러 메시지 정제**: 민감한 정보 노출 방지

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
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLoginAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
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

### 세션 데이터 (sessions.json)
```json
{
  "sessions": [
    {
      "tokenId": "token-prefix",
      "userId": "user-id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "expiresAt": "2024-01-08T00:00:00.000Z",
      "isBlacklisted": true
    }
  ]
}
```

### 통계 데이터 (stats.json)
```json
{
  "stats": {
    "totalUsers": 10,
    "activeUsers": 5,
    "totalOptimizations": 100,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🎯 사용법

### 프론트엔드에서 API 호출

```javascript
import { signupUser, loginUser, getCurrentUser, logoutUser } from '../utils/api';

// 회원가입
const result = await signupUser({ 
  nickname: '사용자', 
  email: 'user@example.com', 
  password: 'SecurePass123!',
  passwordConfirm: 'SecurePass123!' 
});

// 로그인
const result = await loginUser({ 
  email: 'user@example.com', 
  password: 'SecurePass123!' 
});

// 현재 사용자 정보
const result = await getCurrentUser();

// 로그아웃
const result = await logoutUser();
```

### UserContext 사용

```javascript
import { useUser } from '../contexts/UserContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout, loading } = useUser();
  
  if (loading) {
    return <div>로딩 중...</div>;
  }
  
  if (isAuthenticated) {
    return (
      <div>
        <p>환영합니다, {user.nickname}님!</p>
        <button onClick={logout}>로그아웃</button>
      </div>
    );
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
5. 비밀번호 해싱 후 GitHub Repository에 저장
6. JWT 토큰 생성 및 반환
7. 자동 로그인 처리

### 로그인 플로우
1. 사용자가 로그인 폼 작성
2. API 호출 (`/auth/login`)
3. GitHub Repository에서 이메일로 사용자 조회
4. 비밀번호 검증 (bcrypt.compare)
5. JWT 토큰 생성 및 반환
6. 마지막 로그인 시간 업데이트
7. 로그인 상태 업데이트

### 자동 로그인 플로우
1. 앱 시작 시 localStorage에서 토큰 확인
2. 토큰이 있으면 `/auth/me` 호출
3. 토큰 유효성 검증 (만료, 블랙리스트 체크)
4. 사용자 정보 반환 및 상태 업데이트

### 로그아웃 플로우
1. 사용자가 로그아웃 버튼 클릭
2. API 호출 (`/auth/logout`)
3. 토큰을 블랙리스트에 추가
4. localStorage에서 토큰 제거
5. 로그인 상태 초기화

## 🛠️ 트러블슈팅

### 일반적인 문제들

1. **GitHub API 403 에러**
   - Personal Access Token 권한 확인
   - Repository 접근 권한 확인
   - 토큰 만료 여부 확인

2. **JWT 토큰 에러**
   - JWT_SECRET 환경 변수 설정 확인
   - 토큰 만료 시간 확인
   - 토큰 형식 확인

3. **CORS 에러**
   - Netlify Functions CORS 헤더 설정 확인
   - 브라우저 개발자 도구에서 네트워크 탭 확인

4. **비밀번호 해싱 에러**
   - bcryptjs 패키지 설치 확인
   - BCRYPT_ROUNDS 환경 변수 확인

5. **환경 변수 문제**
   - Netlify 대시보드에서 환경 변수 설정 확인
   - 변수명 대소문자 정확히 확인

## 📈 모니터링 및 로깅

### 로그 확인 방법
1. **Netlify Functions 로그**: Netlify 대시보드 → Functions 탭
2. **브라우저 콘솔**: 프론트엔드 에러 확인
3. **GitHub Repository**: 데이터 변경 사항 확인

### 주요 메트릭
- 총 사용자 수
- 활성 사용자 수
- 로그인 성공/실패율
- API 응답 시간

## 🚀 향후 개선 사항

### 단기 개선
- [ ] 이메일 인증 기능
- [ ] 비밀번호 재설정
- [ ] 프로필 이미지 업로드
- [ ] 사용자 설정 관리

### 장기 개선
- [ ] 소셜 로그인 (Google, GitHub)
- [ ] 2FA (Two-Factor Authentication)
- [ ] 실제 데이터베이스 연동 (PostgreSQL, MongoDB)
- [ ] Redis 캐싱
- [ ] 실시간 알림

### 성능 최적화
- [ ] 토큰 캐싱
- [ ] 사용자 데이터 캐싱
- [ ] API 응답 최적화
- [ ] 이미지 최적화

## 📝 참고 자료

- [JWT 공식 문서](https://jwt.io/)
- [bcrypt.js 라이브러리](https://github.com/dcodeIO/bcrypt.js)
- [GitHub API 문서](https://docs.github.com/en/rest)
- [Netlify Functions 가이드](https://docs.netlify.com/functions/overview/)
- [React Context API](https://reactjs.org/docs/context.html)

---

**마지막 업데이트**: 2024년 1월 (인증 시스템 완전 구현 완료) 