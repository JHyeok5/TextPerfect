# TextPerfect API 가이드 (Netlify Functions)

이 문서는 TextPerfect 프로젝트의 서버리스 백엔드 API 명세를 정의합니다.

---

## 텍스트 최적화 API

- **엔드포인트**: `/.netlify/functions/optimize`
- **HTTP Method**: `POST`
- **설명**: 사용자가 입력한 텍스트를 지정된 목표(예: 비즈니스 이메일, 블로그 초고)에 맞게 Claude AI 모델을 통해 최적화하고 결과를 반환합니다.

### Request Body

```json
{
  "text": "필요한 최소한의 범위 내에서, 버전 호환성, 라이선스, 보안 이슈 등을 고려합니다.",
  "goal": "초등학생도 이해할 수 있도록 쉽게 설명",
  "apiKey": "sk-...",
  "options": {
    "strength": "medium" 
  }
}
```

| 필드명 | 타입 | 필수 여부 | 설명 |
|---|---|---|---|
| `text` | string | 예 | 최적화를 원하는 원본 텍스트 |
| `goal` | string | 예 | 텍스트 최적화의 목표 또는 컨텍스트 |
| `apiKey` | string | 아니오 | 사용자가 자신의 API 키를 사용할 경우. (제공되지 않으면 서버 기본 키 사용) |
| `options` | object | 아니오 | 추가적인 최적화 옵션 (예: 강도, 톤앤매너 등) |

### Success Response (200 OK)

```json
{
  "success": true,
  "data": {
    "originalText": "필요한 최소한의 범위 내에서, 버전 호환성, 라이선스, 보안 이슈 등을 고려합니다.",
    "optimizedText": "우리가 사용하는 프로그램 재료들이 서로 잘 맞는지, 사용해도 되는 것인지, 그리고 안전한지 꼼꼼히 살펴봐야 해요.",
    "usage": {
      "input_tokens": 50,
      "output_tokens": 85
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

### 보조 유틸리티 함수

- `utils/auth.js`: API 요청에 대한 인증 및 권한 부여를 처리합니다. (예: API 키 검증)
- `utils/claude.js`: Anthropic의 Claude AI 모델과 직접 통신하는 로직을 담당합니다.
- `utils/response.js`: API의 응답 형식을 표준화(성공/실패)하는 래퍼 함수를 제공합니다. 