/**
 * 비밀번호 관리 유틸리티
 * 비밀번호 해싱, 검증, 강도 체크 등의 기능 제공
 */

const bcrypt = require('bcryptjs');

/**
 * 비밀번호 해싱
 */
async function hashPassword(password) {
  const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 12;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * 비밀번호 검증
 */
async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * 비밀번호 강도 검증
 */
function validatePasswordStrength(password) {
  const errors = [];
  
  // 길이 체크 (최소 8자)
  if (password.length < 8) {
    errors.push('비밀번호는 최소 8자 이상이어야 합니다.');
  }
  
  // 최대 길이 체크 (보안상 128자 제한)
  if (password.length > 128) {
    errors.push('비밀번호는 최대 128자까지 가능합니다.');
  }
  
  // 영문 대문자 포함 체크
  if (!/[A-Z]/.test(password)) {
    errors.push('비밀번호에 영문 대문자를 포함해주세요.');
  }
  
  // 영문 소문자 포함 체크
  if (!/[a-z]/.test(password)) {
    errors.push('비밀번호에 영문 소문자를 포함해주세요.');
  }
  
  // 숫자 포함 체크
  if (!/[0-9]/.test(password)) {
    errors.push('비밀번호에 숫자를 포함해주세요.');
  }
  
  // 특수문자 포함 체크
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('비밀번호에 특수문자를 포함해주세요.');
  }
  
  // 연속된 문자 체크 (예: 123, abc, aaa)
  if (/(.)\1{2,}/.test(password)) {
    errors.push('동일한 문자가 3번 이상 연속으로 사용될 수 없습니다.');
  }
  
  // 일반적인 패턴 체크
  const commonPatterns = [
    /12345/,
    /abcde/,
    /qwerty/,
    /password/i,
    /admin/i
  ];
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('일반적인 패턴은 사용할 수 없습니다.');
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    strength: calculatePasswordStrength(password)
  };
}

/**
 * 비밀번호 강도 계산 (0-100)
 */
function calculatePasswordStrength(password) {
  let score = 0;
  
  // 길이 점수 (최대 25점)
  score += Math.min(password.length * 2, 25);
  
  // 문자 종류 다양성 점수 (최대 40점)
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^A-Za-z0-9]/.test(password)) score += 10;
  
  // 복잡성 점수 (최대 35점)
  const uniqueChars = new Set(password).size;
  score += Math.min(uniqueChars * 2, 20);
  
  // 패턴 없음 보너스
  if (!/(.)\1{1,}/.test(password)) score += 5;
  if (!/012|123|234|345|456|567|678|789|890/.test(password)) score += 5;
  if (!/abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(password)) score += 5;
  
  return Math.min(score, 100);
}

/**
 * 비밀번호 강도 레벨 반환
 */
function getPasswordStrengthLevel(score) {
  if (score >= 80) return 'very-strong';
  if (score >= 60) return 'strong';
  if (score >= 40) return 'medium';
  if (score >= 20) return 'weak';
  return 'very-weak';
}

/**
 * 비밀번호 생성 (임시 비밀번호 등에 사용)
 */
function generateSecurePassword(length = 12) {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = lowercase + uppercase + numbers + symbols;
  let password = '';
  
  // 각 문자 종류에서 최소 1개씩 포함
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // 나머지 길이만큼 랜덤 문자 추가
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // 문자 순서 섞기
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

module.exports = {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
  calculatePasswordStrength,
  getPasswordStrengthLevel,
  generateSecurePassword
}; 