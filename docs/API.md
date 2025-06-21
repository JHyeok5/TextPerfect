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

## 결제 시스템 API (C단계 Phase 1 완료)

### 결제 세션 생성

#### POST /stripe-create-checkout
Stripe 결제 세션을 생성합니다.

**헤더:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**요청:**
```json
{
  "priceId": "price_monthly_premium",
  "plan": "PREMIUM_MONTHLY"
}
```

**응답:**
```json
{
  "success": true,
  "message": "결제 세션이 생성되었습니다.",
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/pay/cs_test_..."
  }
}
```

### 구독 상태 조회

#### GET /stripe-get-subscription
현재 사용자의 구독 상태를 조회합니다.

**헤더:**
```
Authorization: Bearer <jwt-token>
```

**응답:**
```json
{
  "success": true,
  "message": "구독 정보를 조회했습니다.",
  "data": {
    "subscription": {
      "id": "sub_...",
      "status": "active",
      "plan": "PREMIUM_MONTHLY",
      "currentPeriodStart": "2024-01-01T00:00:00Z",
      "currentPeriodEnd": "2024-02-01T00:00:00Z",
      "cancelAtPeriodEnd": false
    },
    "customer": {
      "id": "cus_...",
      "email": "user@example.com"
    }
  }
}
```

### 고객 포털 세션 생성

#### POST /stripe-customer-portal
Stripe 고객 포털 세션을 생성합니다.

**헤더:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**요청:**
```json
{
  "returnUrl": "https://textperfect.app/subscription"
}
```

**응답:**
```json
{
  "success": true,
  "message": "고객 포털 세션이 생성되었습니다.",
  "data": {
    "url": "https://billing.stripe.com/session/..."
  }
}
```

### Stripe 웹훅

#### POST /stripe-webhook
Stripe 이벤트를 처리합니다 (내부용).

**헤더:**
```
Stripe-Signature: t=...,v1=...
Content-Type: application/json
```

**처리하는 이벤트:**
- `checkout.session.completed`: 결제 완료
- `customer.subscription.created`: 구독 생성
- `customer.subscription.updated`: 구독 업데이트
- `customer.subscription.deleted`: 구독 취소
- `invoice.payment_succeeded`: 결제 성공
- `invoice.payment_failed`: 결제 실패

## 결제 시스템 API (C단계 Phase 1 완료)

### 결제 세션 생성

#### POST /stripe-create-checkout
Stripe 결제 세션을 생성합니다.

**헤더:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**요청:**
```json
{
  "priceId": "price_monthly_premium",
  "plan": "PREMIUM_MONTHLY"
}
```

**응답:**
```json
{
  "success": true,
  "message": "결제 세션이 생성되었습니다.",
  "data": {
    "sessionId": "cs_test_...",
    "url": "https://checkout.stripe.com/pay/cs_test_..."
  }
}
```

### 구독 상태 조회

#### GET /stripe-get-subscription
현재 사용자의 구독 상태를 조회합니다.

**헤더:**
```
Authorization: Bearer <jwt-token>
```

**응답:**
```json
{
  "success": true,
  "message": "구독 정보를 조회했습니다.",
  "data": {
    "subscription": {
      "id": "sub_...",
      "status": "active",
      "plan": "PREMIUM_MONTHLY",
      "currentPeriodStart": "2024-01-01T00:00:00Z",
      "currentPeriodEnd": "2024-02-01T00:00:00Z",
      "cancelAtPeriodEnd": false
    },
    "customer": {
      "id": "cus_...",
      "email": "user@example.com"
    }
  }
}
```

### 고객 포털 세션 생성

#### POST /stripe-customer-portal
Stripe 고객 포털 세션을 생성합니다.

**헤더:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**요청:**
```json
{
  "returnUrl": "https://textperfect.app/subscription"
}
```

**응답:**
```json
{
  "success": true,
  "message": "고객 포털 세션이 생성되었습니다.",
  "data": {
    "url": "https://billing.stripe.com/session/..."
  }
}
```

### Stripe 웹훅

#### POST /stripe-webhook
Stripe 이벤트를 처리합니다 (내부용).

**헤더:**
```
Stripe-Signature: t=...,v1=...
Content-Type: application/json
```

**처리하는 이벤트:**
- `checkout.session.completed`: 결제 완료
- `customer.subscription.created`: 구독 생성
- `customer.subscription.updated`: 구독 업데이트
- `customer.subscription.deleted`: 구독 취소
- `invoice.payment_succeeded`: 결제 성공
- `invoice.payment_failed`: 결제 실패

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
      "readability": 85,
      "improvements": ["더 쉬운 단어 사용", "문장 구조 개선"]
    },
    "userType": "GUEST",
    "limitations": {
      "maxLength": 500,
      "featuresAvailable": ["기본 최적화"]
    }
  }
}
```

#### FREE 사용자 응답:
```json
{
  "success": true,
  "data": {
    "originalText": "필요한 최소한의 범위 내에서, 버전 호환성, 라이선스, 보안 이슈 등을 고려합니다.",
    "optimizedText": "외부 라이브러리를 도입할 때는 필요한 최소한의 범위에서 사용하며, 버전 호환성, 라이선스, 보안 문제 등을 종합적으로 검토해야 합니다.",
    "analysis": {
      "readability": 78,
      "clarity": 82,
      "improvements": ["전문 용어 설명 추가", "논리적 흐름 개선"],
      "suggestions": ["구체적인 예시 추가 권장"]
    },
    "userType": "FREE",
    "limitations": {
      "maxLength": 1000,
      "featuresAvailable": ["기본 최적화", "가독성 분석"],
      "usage": {
        "dailyUsed": 450,
        "dailyLimit": 1000,
        "monthlyDocs": 3,
        "monthlyLimit": 10
      }
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
    "optimizedText": "외부 라이브러리나 프레임워크를 도입할 때는 필요한 최소한의 범위 내에서 사용하며, 버전 호환성, 라이선스 정책, 보안 취약점 등을 종합적으로 검토하여 프로젝트의 안정성과 지속가능성을 확보해야 합니다.",
    "analysis": {
      "readability": 75,
      "clarity": 88,
      "professionalism": 92,
      "structure": 85,
      "improvements": [
        "구체적인 예시와 함께 설명",
        "단계별 검토 프로세스 제시",
        "리스크 평가 기준 명시"
      ],
      "detailedFeedback": {
        "strengths": ["명확한 주제 제시", "체계적인 접근"],
        "weaknesses": ["구체성 부족", "실행 방안 미흡"],
        "recommendations": [
          "라이브러리 선택 체크리스트 제공",
          "보안 검토 도구 소개",
          "실제 사례 기반 설명 추가"
        ]
      }
    },
    "coaching": {
      "writingStyle": "기술 문서 작성 스타일 적합",
      "nextSteps": ["구체적 실행 방안 추가", "독자 관점에서 재검토"],
      "resources": ["기술 문서 작성 가이드", "라이브러리 평가 체크리스트"]
    },
    "userType": "PREMIUM",
    "limitations": {
      "maxLength": 10000,
      "featuresAvailable": ["고급 최적화", "상세 분석", "AI 코칭", "문법 체크"],
      "usage": {
        "dailyUsed": 1250,
        "dailyLimit": 10000,
        "monthlyDocs": 15,
        "monthlyLimit": 100
      }
    }
  }
}
```

### Error Response (400/401/429/500)

```json
{
  "success": false,
  "error": {
    "code": "LIMIT_EXCEEDED",
    "message": "일일 사용량을 초과했습니다.",
    "details": {
      "used": 1000,
      "limit": 1000,
      "resetAt": "2024-01-02T00:00:00Z"
    }
  }
}
```

## 에러 코드

| 코드 | 설명 |
|---|---|
| `LIMIT_EXCEEDED` | 사용량 한도 초과 |
| `INVALID_TEXT` | 유효하지 않은 텍스트 |
| `AUTHENTICATION_REQUIRED` | 인증 필요 |
| `PREMIUM_REQUIRED` | 프리미엄 플랜 필요 |
| `RATE_LIMIT_EXCEEDED` | 요청 빈도 제한 초과 |
| `STRIPE_ERROR` | Stripe 결제 오류 |
| `SUBSCRIPTION_REQUIRED` | 유효한 구독 필요 |

## 환경 변수

```bash
# 필수 환경 변수
CLAUDE_API_KEY=your_claude_api_key_here

# Stripe 결제 시스템 (C단계 Phase 1)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# 프론트엔드용
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

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