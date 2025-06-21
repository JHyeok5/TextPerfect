#!/usr/bin/env node

/**
 * 환경 변수 체크 스크립트
 * 배포 전 필수 환경 변수가 설정되어 있는지 확인
 */

const requiredEnvVars = [
  'GITHUB_TOKEN',
  'JWT_SECRET'
];

const optionalEnvVars = [
  'NODE_ENV',
  'AWS_LAMBDA_JS_RUNTIME'
];

console.log('🔍 환경 변수 체크 중...\n');

let hasError = false;

// 필수 환경 변수 체크
console.log('📋 필수 환경 변수:');
requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: 설정됨`);
  } else {
    console.log(`❌ ${envVar}: 누락됨`);
    hasError = true;
  }
});

// 선택적 환경 변수 체크
console.log('\n📋 선택적 환경 변수:');
optionalEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar}: ${process.env[envVar]}`);
  } else {
    console.log(`⚠️  ${envVar}: 설정되지 않음 (선택사항)`);
  }
});

if (hasError) {
  console.log('\n❌ 누락된 필수 환경 변수가 있습니다!');
  console.log('Netlify 대시보드에서 환경 변수를 설정해주세요.');
  process.exit(1);
} else {
  console.log('\n✅ 모든 필수 환경 변수가 설정되었습니다!');
} 