# TextPerfect API 문서

## 개요

TextPerfect 프로젝트의 API 엔드포인트와 사용법을 설명합니다.

## 기본 정보

- **Base URL**: `/.netlify/functions/`
- **인증 방식**: JWT Bearer Token
- **응답 형식**: JSON

## 인증 API

### 회원가입

#### POST /auth/signup
새 사용자 계정을 생성합니다.

**요청:**
```json
{
  "nickname": "사용자닉네임",
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "passwordConfirm": "SecurePassword123!"
}
```

**응답:**
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "nickname": "사용자닉네임",
      "level": 1,
      "exp": 0,
      "subscription": {
        "plan": "FREE",
        "usage": {
          "monthlyDocs": 0,
          "maxTextLength": 1000
        }
      },
      "createdAt": "2024-01-01T00:00:00Z"
    },
    "token": "jwt-token-here",
    "expiresIn": "7d"
  }
}
```

### 로그인

#### POST /auth/login
기존 사용자 로그인을 처리합니다.

**요청:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**응답:**
```json
{
  "success": true,
  "message": "로그인되었습니다.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "nickname": "사용자닉네임",
      "level": 1,
      "exp": 0,
      "subscription": {
        "plan": "FREE",
        "usage": {
          "monthlyDocs": 0,
          "maxTextLength": 1000
        }
      },
      "lastLoginAt": "2024-01-01T12:00:00Z"
    },
    "token": "jwt-token-here",
    "expiresIn": "7d"
  }
}
```

### 사용자 정보 조회

#### GET /auth/me
현재 로그인한 사용자의 정보를 조회합니다.

**헤더:**
```
Authorization: Bearer <jwt-token>
```

**응답:**
```json
{
  "success": true,
  "message": "사용자 정보를 조회했습니다.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "nickname": "사용자닉네임",
      "level": 1,
      "exp": 0,
      "subscription": {
        "plan": "FREE",
        "usage": {
          "monthlyDocs": 0,
          "maxTextLength": 1000
        }
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLoginAt": "2024-01-01T12:00:00Z"
    }
  }
}
```

### 로그아웃

#### POST /auth/logout
현재 세션을 종료하고 토큰을 무효화합니다.

**헤더:**
```
Authorization: Bearer <jwt-token>
```

**응답:**
```json
{
  "success": true,
  "message": "로그아웃되었습니다.",
  "data": {}
}
```

## 텍스트 최적화 API (B단계 완성)

- **엔드포인트**: `/.netlify/functions/optimize`
- **HTTP Method**: `POST`
- **설명**: 사용자 유형별로 차별화된 Claude AI 모델을 통해 텍스트를 최적화합니다.

### 사용자 유형별 AI 모델 차별화

| 사용자 유형 | Claude 모델 | 최대 토큰 | 분석 품질 |
|---|---|---|---|
| GUEST | Claude-3-Haiku | 500 | 기본 최적화만 |
| FREE | Claude-3-Haiku | 1,000 | 기본 최적화 + 가독성 분석 |
| PREMIUM | Claude-3-Sonnet | 2,000 | 고급 최적화 + 상세 분석 + 스타일 코칭 + 문법 체크 |

### Request Body

```json
{
  "text": "필요한 최소한의 범위 내에서, 버전 호환성, 라이선스, 보안 이슈 등을 고려합니다.",
  "purpose": "academic",
  "options": {
    "strength": "medium" 
  }
}
```

| 필드명 | 타입 | 필수 여부 | 설명 |
|---|---|---|---|
| `text` | string | 예 | 최적화를 원하는 원본 텍스트 |
| `purpose` | string | 예 | 텍스트 목적 ("academic", "business", "technical", "general") |
| `options` | object | 아니오 | 추가적인 최적화 옵션 (예: 강도, 톤앤매너 등) |

### Request Headers

```
Authorization: Bearer <jwt-token>  // 로그인 사용자만 (GUEST는 불필요)
Content-Type: application/json
```

### Success Response (200 OK)

#### GUEST 사용자 응답:
```json
{
  "success": true,
  "data": {
    "originalText": "필요한 최소한의 범위 내에서, 버전 호환성, 라이선스, 보안 이슈 등을 고려합니다.",
    "optimizedText": "우리가 사용하는 프로그램 재료들이 서로 잘 맞는지, 사용해도 되는 것인지, 그리고 안전한지 꼼꼼히 살펴봐야 해요.",
    "analysis": {
      "improvements": ["문장 길이 조정", "쉬운 단어 사용"]
    },
    "userType": "GUEST",
    "usage": {
      "input_tokens": 50,
      "output_tokens": 85
    }
  }
}
```

#### PREMIUM 사용자 응답:
```json
{
  "success": true,
  "data": {
    "originalText": "필요한 최소한의 범위 내에서, 버전 호환성, 라이선스, 보안 이슈 등을 고려합니다.",
    "optimizedText": "우리가 사용하는 프로그램 재료들이 서로 잘 맞는지, 사용해도 되는 것인지, 그리고 안전한지 꼼꼼히 살펴봐야 해요.",
    "analysis": {
      "improvements": ["문장 길이 조정", "쉬운 단어 사용"],
      "readability": {
        "score": 85,
        "level": "초등학교 고학년"
      },
      "style": {
        "tone": "친근함",
        "formality": "비격식"
      },
      "grammar": {
        "corrections": [],
        "suggestions": ["연결어 다양화 권장"]
      }
    },
    "userType": "PREMIUM",
    "usage": {
      "input_tokens": 50,
      "output_tokens": 185
    }
  }
}
```

### Error Response (4xx/5xx)

```json
{
  "success": false,
  "error": {
    "code": "CLAUDE_API_ERROR",
    "message": "Claude API 처리 중 오류가 발생했습니다."
  }
}
```

---

## 인증 에러 코드

| 코드 | 설명 |
|------|------|
| `VALIDATION_ERROR` | 입력값 검증 실패 |
| `EMAIL_EXISTS` | 이미 사용 중인 이메일 |
| `WEAK_PASSWORD` | 비밀번호 보안 요구사항 미충족 |
| `INVALID_CREDENTIALS` | 잘못된 로그인 정보 |
| `UNAUTHORIZED` | 인증 토큰 없음 또는 무효 |
| `ACCOUNT_DISABLED` | 비활성화된 계정 |
| `TOKEN_ERROR` | 토큰 처리 오류 |
| `STORAGE_ERROR` | 데이터 저장소 오류 |

## 에러 응답

모든 API는 다음 형식의 에러 응답을 반환합니다:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": ["상세 에러 목록"] // 선택사항
  }
}
```

## 상태 코드

- `200` - 성공
- `400` - 잘못된 요청
- `401` - 인증 필요
- `403` - 권한 없음
- `404` - 리소스 없음
- `409` - 충돌 (이메일 중복 등)
- `429` - 요청 제한 초과
- `500` - 서버 오류
- `503` - 서비스 이용 불가

## 보안

### JWT 토큰
- 토큰 유효기간: 7일 (기본값)
- 토큰 갱신: 자동 갱신 없음 (재로그인 필요)
- 토큰 무효화: 로그아웃 시 블랙리스트에 추가

### 비밀번호 요구사항
- 최소 8자 이상
- 영문 대소문자, 숫자, 특수문자 포함
- 일반적인 패턴 사용 금지

### Rate Limiting
- 기본: 분당 100회 요청
- 인증 API: 분당 10회 요청 (추가 제한)

### 보조 유틸리티 함수

- `utils/auth.js`: API 요청에 대한 인증 및 권한 부여를 처리합니다.
- `utils/claude.js`: Anthropic의 Claude AI 모델과 직접 통신하는 로직을 담당합니다.
- `utils/response.js`: API의 응답 형식을 표준화(성공/실패)하는 래퍼 함수를 제공합니다.
- `utils/github-storage.js`: GitHub Repository를 데이터 저장소로 사용하는 유틸리티입니다.
- `utils/jwt.js`: JWT 토큰 생성, 검증, 관리 기능을 제공합니다.
- `utils/password.js`: 비밀번호 해싱, 검증, 강도 체크 기능을 제공합니다.
- `utils/validation.js`: 입력값 검증 및 정제 기능을 제공합니다. 