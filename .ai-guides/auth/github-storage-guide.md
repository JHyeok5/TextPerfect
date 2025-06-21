# GitHub Repository를 데이터베이스로 사용하기

## 📋 개요

TextPerfect는 GitHub Private Repository를 데이터베이스로 사용하는 혁신적인 접근 방식을 채택했습니다. 이는 서버리스 환경에서 무료로 안전한 데이터 저장소를 구축할 수 있는 창의적인 솔루션입니다.

## 🏗️ 아키텍처 개념

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ Netlify Functions│    │  GitHub API     │    │ Private Repository│
│                 │    │                 │    │                 │
│ • CRUD 작업     │◄──►│ • REST API      │◄──►│ • JSON 파일     │
│ • 인증 처리     │    │ • Base64 인코딩 │    │ • 버전 관리     │
│ • 데이터 검증   │    │ • 커밋 히스토리 │    │ • 백업 자동화   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎯 장점과 단점

### ✅ **장점**
- **무료**: GitHub Private Repository 무료 제공
- **안전**: Private Repository로 데이터 보안 보장
- **백업**: Git 히스토리로 자동 백업
- **확장성**: 필요시 실제 DB로 쉽게 마이그레이션 가능
- **투명성**: 모든 데이터 변경 사항 추적 가능
- **접근성**: GitHub API를 통한 표준화된 접근

### ⚠️ **단점**
- **성능**: 대용량 데이터나 높은 동시성에는 부적합
- **제한**: GitHub API Rate Limit (시간당 5,000회)
- **복잡성**: 트랜잭션이나 복잡한 쿼리 불가능
- **지연**: 네트워크 요청으로 인한 응답 지연

## 📁 Repository 구조

### 파일 구조
```
TextPerfect-userdata/
├── users.json          # 사용자 계정 정보
├── sessions.json       # 세션 및 토큰 관리
├── stats.json          # 애플리케이션 통계
└── README.md           # 저장소 설명
```

### 데이터 스키마

#### users.json
```json
{
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "nickname": "사용자닉네임",
      "passwordHash": "$2b$12$...",
      "level": 1,
      "exp": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLoginAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "isActive": true,
      "subscription": {
        "plan": "FREE",
        "expiresAt": null,
        "usage": {
          "monthlyDocs": 0,
          "maxTextLength": 1000
        }
      }
    }
  ]
}
```

#### sessions.json
```json
{
  "sessions": [
    {
      "tokenId": "abc123def4",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "expiresAt": "2024-01-08T00:00:00.000Z",
      "isBlacklisted": true
    }
  ]
}
```

#### stats.json
```json
{
  "stats": {
    "totalUsers": 150,
    "activeUsers": 75,
    "totalOptimizations": 2500,
    "lastUpdated": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🔧 구현 세부사항

### GitHub API 연동

#### 기본 설정
```javascript
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME;
const GITHUB_REPO = process.env.GITHUB_REPO;
```

#### API 요청 헬퍼
```javascript
async function githubApiRequest(endpoint, method = 'GET', data = null) {
  const url = `${GITHUB_API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'TextPerfect-App'
    }
  };

  if (data) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
```

### 파일 읽기/쓰기

#### 파일 내용 읽기
```javascript
async function getFileContent(filePath) {
  try {
    const endpoint = `/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filePath}`;
    const response = await githubApiRequest(endpoint);
    
    // Base64 디코딩
    const content = Buffer.from(response.content, 'base64').toString('utf-8');
    return {
      content: JSON.parse(content),
      sha: response.sha
    };
  } catch (error) {
    if (error.message.includes('404')) {
      // 파일이 없으면 기본 구조 반환
      return {
        content: getDefaultFileContent(filePath),
        sha: null
      };
    }
    throw error;
  }
}
```

#### 파일 내용 저장
```javascript
async function saveFileContent(filePath, content, sha = null) {
  const endpoint = `/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filePath}`;
  
  const data = {
    message: `Update ${filePath}`,
    content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64')
  };

  if (sha) {
    data.sha = sha;
  }

  return await githubApiRequest(endpoint, 'PUT', data);
}
```

## 🔄 CRUD 작업 패턴

### Create (생성)
```javascript
async function createUser(userData) {
  const usersData = await getUsersData();
  
  const newUser = {
    id: uuidv4(),
    ...userData,
    createdAt: new Date().toISOString()
  };

  usersData.users.push(newUser);
  await saveUsersData(usersData);
  
  return newUser;
}
```

### Read (조회)
```javascript
async function findUserByEmail(email) {
  const usersData = await getUsersData();
  return usersData.users.find(user => 
    user.email.toLowerCase() === email.toLowerCase()
  );
}
```

### Update (수정)
```javascript
async function updateUser(userId, updateData) {
  const usersData = await getUsersData();
  const userIndex = usersData.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  usersData.users[userIndex] = {
    ...usersData.users[userIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  await saveUsersData(usersData);
  return usersData.users[userIndex];
}
```

### Delete (삭제)
```javascript
async function deleteUser(userId) {
  const usersData = await getUsersData();
  const userIndex = usersData.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  const deletedUser = usersData.users.splice(userIndex, 1)[0];
  await saveUsersData(usersData);
  
  return deletedUser;
}
```

## 🚀 성능 최적화

### 1. 데이터 캐싱
```javascript
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5분

async function getCachedData(key, fetchFunction) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetchFunction();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

### 2. 배치 작업
```javascript
async function batchUpdateUsers(updates) {
  const usersData = await getUsersData();
  
  updates.forEach(({ userId, updateData }) => {
    const userIndex = usersData.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      usersData.users[userIndex] = {
        ...usersData.users[userIndex],
        ...updateData
      };
    }
  });

  await saveUsersData(usersData);
}
```

### 3. 데이터 압축
```javascript
function compressData(data) {
  // 불필요한 필드 제거
  return data.map(item => {
    const { unnecessaryField, ...essentialData } = item;
    return essentialData;
  });
}
```

## 🔒 보안 고려사항

### 1. 환경 변수 보안
```bash
# Netlify 환경 변수에서만 설정
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_USERNAME=your-username
GITHUB_REPO=TextPerfect-userdata
```

### 2. 토큰 권한 최소화
- **필요한 권한만**: `repo` (Private repository 접근)
- **정기적 갱신**: 토큰 만료 설정
- **모니터링**: 비정상적인 API 사용 감지

### 3. 데이터 검증
```javascript
function validateUserData(userData) {
  const errors = [];
  
  if (!userData.email || !isValidEmail(userData.email)) {
    errors.push('유효한 이메일이 필요합니다.');
  }
  
  if (!userData.nickname || userData.nickname.length < 2) {
    errors.push('닉네임은 2자 이상이어야 합니다.');
  }
  
  return { isValid: errors.length === 0, errors };
}
```

## 📊 모니터링 및 로깅

### 1. API 사용량 추적
```javascript
async function trackApiUsage(operation, filePath) {
  console.log(`GitHub API: ${operation} ${filePath} at ${new Date().toISOString()}`);
  
  // 필요시 사용량 통계 저장
  await updateStats('apiCall');
}
```

### 2. 에러 로깅
```javascript
function logError(error, context) {
  console.error('GitHub Storage Error:', {
    message: error.message,
    context,
    timestamp: new Date().toISOString(),
    stack: error.stack
  });
}
```

### 3. 성능 메트릭
```javascript
async function measurePerformance(operation, fn) {
  const startTime = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    console.log(`${operation} completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`${operation} failed after ${duration}ms:`, error.message);
    throw error;
  }
}
```

## 🔄 마이그레이션 전략

### 실제 데이터베이스로 이전

#### 1. PostgreSQL 마이그레이션
```sql
-- 사용자 테이블 생성
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nickname VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  level INTEGER DEFAULT 1,
  exp INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);
```

#### 2. 데이터 이전 스크립트
```javascript
async function migrateToPostgreSQL() {
  const usersData = await getUsersData();
  
  for (const user of usersData.users) {
    await db.query(`
      INSERT INTO users (id, email, nickname, password_hash, level, exp, created_at, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      user.id,
      user.email,
      user.nickname,
      user.passwordHash,
      user.level,
      user.exp,
      user.createdAt,
      user.isActive
    ]);
  }
}
```

## 🛠️ 트러블슈팅

### 일반적인 문제들

#### 1. Rate Limit 초과
```javascript
async function handleRateLimit(error) {
  if (error.message.includes('rate limit')) {
    const resetTime = parseInt(error.headers['x-ratelimit-reset']) * 1000;
    const waitTime = resetTime - Date.now();
    
    console.log(`Rate limit exceeded. Waiting ${waitTime}ms...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // 재시도
    return true;
  }
  return false;
}
```

#### 2. 동시성 문제
```javascript
const fileLocks = new Map();

async function withFileLock(filePath, operation) {
  while (fileLocks.has(filePath)) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  fileLocks.set(filePath, true);
  try {
    return await operation();
  } finally {
    fileLocks.delete(filePath);
  }
}
```

#### 3. 네트워크 오류 처리
```javascript
async function retryOperation(operation, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000; // 지수 백오프
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

## 📈 확장성 고려사항

### 1. 파일 분할
```javascript
// 사용자 수가 많아지면 파일을 분할
function getUserFilePath(userId) {
  const prefix = userId.substring(0, 2);
  return `users/${prefix}/${userId}.json`;
}
```

### 2. 인덱싱 전략
```javascript
// 이메일 인덱스 파일 생성
async function updateEmailIndex(email, userId) {
  const indexData = await getFileContent('indexes/email.json');
  indexData.content[email] = userId;
  await saveFileContent('indexes/email.json', indexData.content, indexData.sha);
}
```

### 3. 아카이빙
```javascript
// 비활성 사용자 아카이빙
async function archiveInactiveUsers() {
  const cutoffDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000); // 1년
  const usersData = await getUsersData();
  
  const activeUsers = [];
  const archivedUsers = [];
  
  usersData.users.forEach(user => {
    if (new Date(user.lastLoginAt) > cutoffDate) {
      activeUsers.push(user);
    } else {
      archivedUsers.push(user);
    }
  });
  
  await saveFileContent('users.json', { users: activeUsers });
  await saveFileContent('archived/users.json', { users: archivedUsers });
}
```

## 📝 베스트 프랙티스

### 1. 파일 구조 설계
- **단일 책임**: 각 파일은 하나의 데이터 타입만 관리
- **적절한 크기**: 파일당 1MB 이하 유지
- **명확한 네이밍**: 파일명으로 내용을 쉽게 파악 가능

### 2. 데이터 무결성
- **원자적 작업**: 파일 전체를 한 번에 업데이트
- **백업 전략**: 중요한 변경 전 백업 생성
- **검증 로직**: 데이터 저장 전 유효성 검사

### 3. 성능 최적화
- **캐싱 활용**: 자주 읽는 데이터는 메모리 캐시
- **배치 처리**: 여러 변경 사항을 한 번에 처리
- **압축 고려**: 큰 데이터는 압축 저장

## 🎯 결론

GitHub Repository를 데이터베이스로 사용하는 방식은 소규모 프로젝트나 프로토타입에 매우 유용한 접근법입니다. 특히 서버리스 환경에서 무료로 안전한 데이터 저장소를 구축할 수 있다는 점에서 큰 장점이 있습니다.

하지만 프로젝트가 성장하고 사용자가 증가하면 전통적인 데이터베이스로의 마이그레이션을 고려해야 합니다. 다행히 현재 구조는 이러한 마이그레이션을 염두에 두고 설계되어 있어 비교적 쉽게 전환할 수 있습니다.

---

**마지막 업데이트**: 2024년 1월 (GitHub Storage 시스템 완전 구현 완료) 