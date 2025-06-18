// 이메일 유효성 검사
export function isValidEmail(email) {
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
}

// 텍스트 길이 체크
export function isLengthInRange(text, min, max) {
  if (typeof text !== 'string') return false;
  return text.length >= min && text.length <= max;
}

// 필수 입력값 체크
export function isRequired(value) {
  return value !== undefined && value !== null && String(value).trim() !== '';
}

// 커스텀 validation 추가 가능 