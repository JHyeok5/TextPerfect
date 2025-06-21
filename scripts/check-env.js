#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * 환경 변수 체크 스크립트
 * Netlify 배포 환경에서만 필수 환경 변수가 설정되어 있는지 확인
 */

// Netlify 환경인지 확인
const isNetlify = process.env.NETLIFY === 'true';

if (!isNetlify) {
  console.log('🏠 로컬 환경에서는 환경 변수 체크를 건너뜁니다.');
  console.log('Netlify 배포 시에만 환경 변수가 체크됩니다.');
  process.exit(0);
}

// 필수 환경 변수 정의
const requiredEnvVars = {
  // AI 서비스
  'CLAUDE_API_KEY': {
    description: 'Claude AI API 키',
    example: 'sk-ant-api03-...',
    required: true
  },
  
  // Stripe 결제 시스템 (C단계 Phase 1)
  'STRIPE_SECRET_KEY': {
    description: 'Stripe 시크릿 키',
    example: 'sk_test_... 또는 sk_live_...',
    required: true
  },
  'STRIPE_PUBLISHABLE_KEY': {
    description: 'Stripe 퍼블리셔블 키',
    example: 'pk_test_... 또는 pk_live_...',
    required: true
  },
  'STRIPE_WEBHOOK_SECRET': {
    description: 'Stripe 웹훅 시크릿',
    example: 'whsec_...',
    required: true
  },
  
  // 프론트엔드용
  'REACT_APP_STRIPE_PUBLISHABLE_KEY': {
    description: 'React 앱용 Stripe 퍼블리셔블 키',
    example: 'pk_test_... 또는 pk_live_...',
    required: true
  },
  
  // GitHub Storage (C단계 Phase 2)
  'GITHUB_TOKEN': {
    description: 'GitHub Personal Access Token (또는 GITHUB_PERSONAL_ACCESS_TOKEN)',
    example: 'ghp_...',
    required: true,
    alternative: 'GITHUB_PERSONAL_ACCESS_TOKEN'
  },
  'GITHUB_REPO_OWNER': {
    description: 'GitHub 데이터 저장소 소유자',
    example: 'textperfect-data',
    required: false,
    default: 'textperfect-data'
  },
  'GITHUB_REPO_NAME': {
    description: 'GitHub 데이터 저장소 이름',
    example: 'user-data',
    required: false,
    default: 'user-data'
  },
  
  // JWT 인증
  'JWT_SECRET': {
    description: 'JWT 토큰 시크릿 키',
    example: 'your-super-secret-jwt-key-here',
    required: true
  }
};

// 선택적 환경 변수 (향후 확장용)
const optionalEnvVars = {
  // OAuth (Phase 2 예정)
  'GOOGLE_CLIENT_ID': {
    description: 'Google OAuth 클라이언트 ID',
    example: '123456789-abc.apps.googleusercontent.com'
  },
  'GOOGLE_CLIENT_SECRET': {
    description: 'Google OAuth 클라이언트 시크릿',
    example: 'GOCSPX-...'
  },
  'GITHUB_CLIENT_ID': {
    description: 'GitHub OAuth 앱 ID',
    example: 'Iv1.1234567890abcdef'
  },
  'GITHUB_CLIENT_SECRET': {
    description: 'GitHub OAuth 앱 시크릿',
    example: '1234567890abcdef...'
  }
};

console.log('🔍 TextPerfect 환경 변수 체크 (C단계 Phase 2)\n');

let hasErrors = false;
let hasWarnings = false;

// .env 파일 존재 여부 확인
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  .env 파일이 없습니다. 루트 디렉토리에 .env 파일을 생성하세요.\n');
  hasWarnings = true;
}

// 필수 환경 변수 체크
console.log('📋 필수 환경 변수 체크:');
for (const [key, config] of Object.entries(requiredEnvVars)) {
  const value = process.env[key];
  const altValue = config.alternative ? process.env[config.alternative] : null;
  
  if (!value && !altValue) {
    if (config.required) {
      console.log(`❌ ${key}: 누락됨`);
      console.log(`   설명: ${config.description}`);
      console.log(`   예시: ${config.example}`);
      if (config.alternative) {
        console.log(`   대안: ${config.alternative} 사용 가능`);
      }
      console.log('');
      hasErrors = true;
    } else {
      console.log(`⚠️  ${key}: 누락됨 (기본값: ${config.default})`);
      console.log(`   설명: ${config.description}`);
      console.log('');
      hasWarnings = true;
    }
  } else {
    const actualValue = value || altValue;
    const maskedValue = actualValue.length > 10 
      ? actualValue.substring(0, 8) + '...' 
      : '***';
    console.log(`✅ ${key}: ${maskedValue}`);
  }
}

console.log('\n📋 선택적 환경 변수 체크 (향후 기능용):');
for (const [key, config] of Object.entries(optionalEnvVars)) {
  const value = process.env[key];
  
  if (value) {
    const maskedValue = value.length > 10 
      ? value.substring(0, 8) + '...' 
      : '***';
    console.log(`✅ ${key}: ${maskedValue}`);
  } else {
    console.log(`⭕ ${key}: 설정되지 않음`);
    console.log(`   설명: ${config.description}`);
  }
}

// 환경별 설정 가이드
console.log('\n🔧 환경별 설정 가이드:');
console.log('');

console.log('개발 환경 (.env):');
console.log('CLAUDE_API_KEY=sk-ant-api03-...');
console.log('STRIPE_SECRET_KEY=sk_test_...');
console.log('STRIPE_PUBLISHABLE_KEY=pk_test_...');
console.log('STRIPE_WEBHOOK_SECRET=whsec_...');
console.log('REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_...');
console.log('GITHUB_TOKEN=ghp_...');
console.log('JWT_SECRET=your-super-secret-jwt-key-here');
console.log('');

console.log('Netlify 배포 환경:');
console.log('1. Netlify 대시보드 → Site settings → Environment variables');
console.log('2. 위의 모든 환경 변수를 추가');
console.log('3. Stripe 웹훅 엔드포인트: https://your-domain.netlify.app/.netlify/functions/stripe-webhook');
console.log('');

// GitHub Storage 설정 가이드
console.log('📚 GitHub Storage 설정:');
console.log('1. GitHub에서 새 저장소 생성 (예: textperfect-data/user-data)');
console.log('2. Personal Access Token 생성:');
console.log('   - GitHub → Settings → Developer settings → Personal access tokens');
console.log('   - repo 권한 필요');
console.log('3. GITHUB_TOKEN 환경 변수에 토큰 설정');
console.log('');

// 결과 요약
console.log('📊 체크 결과:');
if (hasErrors) {
  console.log('❌ 필수 환경 변수가 누락되었습니다. 위의 가이드를 참조하여 설정하세요.');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  일부 환경 변수가 누락되었지만 기본값으로 동작합니다.');
  console.log('✅ 기본 기능은 정상 작동할 것으로 예상됩니다.');
} else {
  console.log('✅ 모든 환경 변수가 올바르게 설정되었습니다!');
  console.log('🚀 TextPerfect C단계 Phase 2 준비 완료!');
}

console.log('\n💡 추가 정보:');
console.log('- 환경 변수 변경 후 서버 재시작 필요');
console.log('- 프로덕션 환경에서는 라이브 키 사용 권장');
console.log('- GitHub Storage는 프라이빗 저장소 사용 권장'); 