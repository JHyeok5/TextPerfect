// 에러 타입별 처리 및 사용자 메시지 변환, 로깅

const ERROR_MESSAGES = {
  INVALID_API_KEY: 'API 인증에 실패했습니다. 관리자에게 문의하세요.',
  RATE_LIMIT_EXCEEDED: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
  FORBIDDEN: '권한이 없습니다.',
  CLAUDE_API_ERROR: 'AI 서비스에 일시적 문제가 발생했습니다.',
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
};

export default function handleError(err) {
  let code = err?.code || err?.error?.code || 'UNKNOWN_ERROR';
  let message = ERROR_MESSAGES[code] || err?.message || '오류가 발생했습니다.';
  // 콘솔/외부 서비스로 로깅
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error('[Error]', code, message, err);
  }
  // 추후 Sentry 등 외부 연동 가능
  return message;
} 