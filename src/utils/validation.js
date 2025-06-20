// 이메일 유효성 검사
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  return /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email);
}

// 텍스트 길이 체크 (강화된 방어 코드)
export function isLengthInRange(text, min, max) {
  // 방어 코드: text가 null, undefined, 또는 문자열이 아닐 경우 처리
  if (text === null || text === undefined) return false;
  if (typeof text !== 'string') return false;
  
  const safeText = String(text); // 추가 안전장치
  return safeText.length >= min && safeText.length <= max;
}

// 필수 입력값 체크 (강화된 방어 코드)
export function isRequired(value) {
  if (value === null || value === undefined) return false;
  return String(value).trim() !== '';
}

// 커스텀 validation 추가 가능 