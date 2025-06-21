/**
 * 입력값 검증 유틸리티 (강화된 버전)
 * 이메일, 닉네임, 일반 입력값 검증 및 정제 기능 제공
 */

/**
 * 이메일 유효성 검사 (강화된 버전)
 */
function validateEmail(email) {
  const errors = [];
  
  if (!email || typeof email !== 'string') {
    errors.push('이메일 주소를 입력해주세요.');
    return { isValid: false, errors };
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // 길이 체크
  if (trimmedEmail.length > 254) {
    errors.push('이메일 주소가 너무 깁니다.');
  }
  
  // 기본 형식 체크
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegex.test(trimmedEmail)) {
    errors.push('올바른 이메일 형식이 아닙니다.');
  }
  
  // 연속된 점 체크
  if (trimmedEmail.includes('..')) {
    errors.push('이메일에 연속된 점(.)은 사용할 수 없습니다.');
  }
  
  // 시작/끝 점 체크
  if (trimmedEmail.startsWith('.') || trimmedEmail.endsWith('.')) {
    errors.push('이메일은 점(.)으로 시작하거나 끝날 수 없습니다.');
  }
  
  // 도메인 부분 체크
  const parts = trimmedEmail.split('@');
  if (parts.length === 2) {
    const domain = parts[1];
    if (domain.length < 2) {
      errors.push('도메인이 너무 짧습니다.');
    }
    
    // 일반적이지 않은 도메인 체크 (선택적)
    if (!domain.includes('.')) {
      errors.push('올바른 도메인 형식이 아닙니다.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    sanitized: trimmedEmail
  };
}

/**
 * 닉네임 유효성 검사
 */
function validateNickname(nickname) {
  const errors = [];
  
  if (!nickname || typeof nickname !== 'string') {
    errors.push('닉네임을 입력해주세요.');
    return { isValid: false, errors };
  }
  
  const trimmedNickname = nickname.trim();
  
  // 길이 체크
  if (trimmedNickname.length < 2) {
    errors.push('닉네임은 최소 2자 이상이어야 합니다.');
  }
  
  if (trimmedNickname.length > 20) {
    errors.push('닉네임은 최대 20자까지 가능합니다.');
  }
  
  // 허용된 문자 체크 (한글, 영문, 숫자, 일부 특수문자)
  const nicknameRegex = /^[가-힣a-zA-Z0-9._-]+$/;
  if (!nicknameRegex.test(trimmedNickname)) {
    errors.push('닉네임은 한글, 영문, 숫자, 점(.), 언더스코어(_), 하이픈(-)만 사용 가능합니다.');
  }
  
  // 연속된 특수문자 체크
  if (/[._-]{2,}/.test(trimmedNickname)) {
    errors.push('특수문자는 연속으로 사용할 수 없습니다.');
  }
  
  // 시작/끝 특수문자 체크
  if (/^[._-]|[._-]$/.test(trimmedNickname)) {
    errors.push('닉네임은 특수문자로 시작하거나 끝날 수 없습니다.');
  }
  
  // 금지어 체크
  const forbiddenWords = [
    'admin', 'administrator', 'root', 'system', 'null', 'undefined',
    'test', 'guest', 'anonymous', 'user', 'default', 'temp',
    '관리자', '운영자', '테스트', '손님', '익명'
  ];
  
  const lowerNickname = trimmedNickname.toLowerCase();
  for (const word of forbiddenWords) {
    if (lowerNickname.includes(word.toLowerCase())) {
      errors.push('사용할 수 없는 닉네임입니다.');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    sanitized: trimmedNickname
  };
}

/**
 * 필수 입력값 체크 (강화된 방어 코드)
 */
function isRequired(value, fieldName = '필드') {
  if (value === null || value === undefined) {
    return { isValid: false, error: `${fieldName}를 입력해주세요.` };
  }
  
  const stringValue = String(value).trim();
  if (stringValue === '') {
    return { isValid: false, error: `${fieldName}를 입력해주세요.` };
  }
  
  return { isValid: true, error: null };
}

/**
 * 문자열 길이 검증
 */
function validateLength(value, min = 0, max = Infinity, fieldName = '입력값') {
  const errors = [];
  
  if (typeof value !== 'string') {
    errors.push(`${fieldName}는 문자열이어야 합니다.`);
    return { isValid: false, errors };
  }
  
  const length = value.trim().length;
  
  if (length < min) {
    errors.push(`${fieldName}는 최소 ${min}자 이상이어야 합니다.`);
  }
  
  if (length > max) {
    errors.push(`${fieldName}는 최대 ${max}자까지 가능합니다.`);
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}

/**
 * HTML/스크립트 태그 제거 (XSS 방지)
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * SQL 인젝션 방지를 위한 입력값 정제
 */
function sanitizeForQuery(input) {
  if (typeof input !== 'string') {
    return input;
  }
  
  return input
    .replace(/['"\\]/g, '')
    .replace(/--/g, '')
    .replace(/;/g, '')
    .replace(/\/\*/g, '')
    .replace(/\*\//g, '')
    .trim();
}

/**
 * 회원가입 데이터 전체 검증
 */
function validateSignupData(data) {
  const errors = [];
  
  // 닉네임 검증
  const nicknameValidation = validateNickname(data.nickname);
  if (!nicknameValidation.isValid) {
    errors.push(...nicknameValidation.errors);
  }
  
  // 이메일 검증
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors);
  }
  
  // 비밀번호 필수 체크 (강도 검증은 password.js에서)
  const passwordRequired = isRequired(data.password, '비밀번호');
  if (!passwordRequired.isValid) {
    errors.push(passwordRequired.error);
  }
  
  // 비밀번호 확인 체크
  const passwordConfirmRequired = isRequired(data.passwordConfirm, '비밀번호 확인');
  if (!passwordConfirmRequired.isValid) {
    errors.push(passwordConfirmRequired.error);
  } else if (data.password !== data.passwordConfirm) {
    errors.push('비밀번호가 일치하지 않습니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    sanitizedData: {
      nickname: nicknameValidation.sanitized || sanitizeInput(data.nickname),
      email: emailValidation.sanitized || sanitizeInput(data.email),
      password: data.password // 비밀번호는 해싱 전까지 원본 유지
    }
  };
}

/**
 * 로그인 데이터 검증
 */
function validateLoginData(data) {
  const errors = [];
  
  // 이메일 검증
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.isValid) {
    errors.push('올바른 이메일 주소를 입력해주세요.');
  }
  
  // 비밀번호 필수 체크
  const passwordRequired = isRequired(data.password, '비밀번호');
  if (!passwordRequired.isValid) {
    errors.push(passwordRequired.error);
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors,
    sanitizedData: {
      email: emailValidation.sanitized || sanitizeInput(data.email),
      password: data.password
    }
  };
}

module.exports = {
  validateEmail,
  validateNickname,
  isRequired,
  validateLength,
  sanitizeInput,
  sanitizeForQuery,
  validateSignupData,
  validateLoginData
}; 