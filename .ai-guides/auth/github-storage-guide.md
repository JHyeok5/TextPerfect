# GitHub 저장소를 데이터베이스로 사용하는 가이드

## 📋 개요

TextPerfect 프로젝트에서는 사용자 데이터를 GitHub Private Repository에 JSON 파일로 저장하는 방식을 사용합니다. 이는 외부 데이터베이스 서비스 없이도 영구적인 데이터 저장을 가능하게 합니다.

## 🎯 선택 이유

### 장점
- ✅ **완전 무료**: GitHub Private Repository 무료 사용
- ✅ **외부 의존성 없음**: 추가 서비스 설정 불필요
- ✅ **버전 관리**: Git을 통한 데이터 변경 이력 관리
- ✅ **백업**: GitHub의 안정적인 백업 시스템
- ✅ **확장성**: 나중에 실제 DB로 쉽게 마이그레이션 가능

### 단점
- ❌ **성능**: 대용량 데이터나 높은 동시성에는 부적합
- ❌ **복잡한 쿼리**: SQL과 같은 복잡한 데이터 조작 어려움
- ❌ **API 제한**: GitHub API Rate Limit 존재

## 🏗️ 아키텍처

```
Netlify Functions ↔ GitHub API ↔ Private Repository
                                      ↓
                               JSON 파일들 (data/)
```

## 📁 Repository 구조

```
textperfect-userdata/ (Private Repository)
├── data/
│   ├── users.json          # 사용자 정보
│   ├── sessions.json       # 토큰 블랙리스트
│   └── stats.json          # 통계 정보
├── backups/                # 백업 파일들 (선택사항)
└── README.md               # Repository 설명
```

## 🔧 설정 방법

### 1. GitHub Repository 생성

1. GitHub에서 새 Private Repository 생성
   - Repository 이름: `textperfect-userdata`
   - 가시성: **Private**
   - README 파일 포함

2. 초기 디렉토리 구조 생성
   ```bash
   mkdir data
   echo '{"users":[]}' > data/users.json
   echo '{"blacklistedTokens":[]}' > data/sessions.json
   echo '{"totalUsers":0,"totalLogins":0,"lastUpdated":""}' > data/stats.json
   ```

### 2. Personal Access Token 발급

1. GitHub Settings → Developer settings → Personal access tokens
2. "Generate new token (classic)" 클릭
3. 권한 설정:
   - ✅ `repo` (Full control of private repositories)
   - ✅ `repo:status`
   - ✅ `repo_deployment`
   - ✅ `public_repo`
4. 토큰 복사 및 안전하게 보관

### 3. 환경 변수 설정

```env
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=your-github-username
GITHUB_REPO=textperfect-userdata
```

## 💻 구현 상세

### GitHub API 연동 함수

```javascript
// netlify/functions/utils/github-storage.js

/**
 * GitHub API 요청 헬퍼 함수
 */
async function githubApiRequest(endpoint, method = 'GET', data = null) {
  const url = `https://api.github.com${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
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

### 파일 읽기/쓰기 함수

```javascript
/**
 * 파일 내용을 GitHub에서 가져오기
 */
async function getFileContent(filePath) {
  try {
    const endpoint = `/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${filePath}`;
    const response = await githubApiRequest(endpoint);
    
    // Base64 디코딩
    const content = Buffer.from(response.content, 'base64').toString('utf-8');
    return {
      content: JSON.parse(content),
      sha: response.sha  // 파일 업데이트에 필요
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

/**
 * 파일 내용을 GitHub에 저장하기
 */
async function saveFileContent(filePath, content, sha = null) {
  const endpoint = `/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}/contents/${filePath}`;
  
  const data = {
    message: `Update ${filePath}`,
    content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64')
  };

  if (sha) {
    data.sha = sha;  // 기존 파일 업데이트 시 필요
  }

  return await githubApiRequest(endpoint, 'PUT', data);
}
```

## 📊 데이터 모델

### users.json 구조

```json
{
  "users": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "nickname": "사용자",
      "passwordHash": "$2a$12$...",
      "level": 1,
      "exp": 0,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "lastLoginAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z",
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

### sessions.json 구조

```json
{
  "blacklistedTokens": [
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "blacklistedAt": "2024-01-01T12:00:00.000Z"
    }
  ]
}
```

### stats.json 구조

```json
{
  "totalUsers": 150,
  "totalLogins": 1250,
  "lastUpdated": "2024-01-01T12:00:00.000Z"
}
```

## 🔄 주요 작업 패턴

### 사용자 생성

```javascript
async function createUser(userData) {
  // 1. 현재 사용자 목록 가져오기
  const usersData = await getUsersData();
  
  // 2. 새 사용자 객체 생성
  const newUser = {
    id: uuidv4(),
    email: userData.email.toLowerCase(),
    nickname: userData.nickname,
    passwordHash: userData.passwordHash,
    level: 1,
    exp: 0,
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    isActive: true,
    subscription: {
      plan: 'FREE',
      expiresAt: null,
      usage: {
        monthlyDocs: 0,
        maxTextLength: 1000
      }
    }
  };

  // 3. 사용자 목록에 추가
  usersData.users.push(newUser);
  
  // 4. GitHub에 저장
  await saveUsersData(usersData);
  
  // 5. 통계 업데이트
  await updateStats('userCreated');
  
  return newUser;
}
```

### 사용자 검색

```javascript
async function findUserByEmail(email) {
  const usersData = await getUsersData();
  return usersData.users.find(user => 
    user.email.toLowerCase() === email.toLowerCase()
  );
}
```

### 사용자 업데이트

```javascript
async function updateUser(userId, updateData) {
  const usersData = await getUsersData();
  const userIndex = usersData.users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  // 업데이트할 데이터 병합
  usersData.users[userIndex] = {
    ...usersData.users[userIndex],
    ...updateData,
    updatedAt: new Date().toISOString()
  };

  await saveUsersData(usersData);
  return usersData.users[userIndex];
}
```

## ⚡ 성능 최적화

### 1. 캐싱 전략

```javascript
// 메모리 캐시 (함수 실행 동안만 유효)
const cache = new Map();

async function getUsersDataCached() {
  const cacheKey = 'users_data';
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const data = await getUsersData();
  cache.set(cacheKey, data);
  
  return data;
}
```

### 2. 배치 작업

```javascript
// 여러 사용자 정보를 한 번에 업데이트
async function batchUpdateUsers(updates) {
  const usersData = await getUsersData();
  
  updates.forEach(({ userId, data }) => {
    const userIndex = usersData.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      usersData.users[userIndex] = {
        ...usersData.users[userIndex],
        ...data,
        updatedAt: new Date().toISOString()
      };
    }
  });
  
  await saveUsersData(usersData);
}
```

## 🛡️ 보안 고려사항

### 1. 토큰 보안
- Personal Access Token을 환경 변수로 관리
- 최소 권한 원칙 (repo 권한만)
- 토큰 정기적 갱신

### 2. 데이터 보안
- Private Repository 사용
- 민감한 정보 암호화 (비밀번호 해싱)
- 로그에 민감한 정보 출력 금지

### 3. API 제한 관리
- GitHub API Rate Limit 모니터링
- 에러 처리 및 재시도 로직
- 캐싱을 통한 API 호출 최소화

## 📈 모니터링

### 1. API 사용량 추적

```javascript
// GitHub API 호출 로깅
async function githubApiRequest(endpoint, method = 'GET', data = null) {
  console.log(`GitHub API: ${method} ${endpoint}`);
  
  const response = await fetch(url, options);
  
  // Rate limit 정보 로깅
  console.log('Rate limit remaining:', response.headers.get('x-ratelimit-remaining'));
  
  return response.json();
}
```

### 2. 에러 모니터링

```javascript
// 에러 발생 시 상세 정보 로깅
catch (error) {
  console.error('GitHub storage error:', {
    message: error.message,
    endpoint: endpoint,
    method: method,
    timestamp: new Date().toISOString()
  });
  throw error;
}
```

## 🔄 마이그레이션 계획

### 실제 데이터베이스로 이전 시

1. **데이터 백업**
   ```javascript
   // GitHub에서 모든 데이터 추출
   const users = await getUsersData();
   const sessions = await getFileContent('data/sessions.json');
   const stats = await getFileContent('data/stats.json');
   ```

2. **스키마 매핑**
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     nickname VARCHAR(50) NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     level INTEGER DEFAULT 1,
     exp INTEGER DEFAULT 0,
     created_at TIMESTAMP DEFAULT NOW(),
     last_login_at TIMESTAMP,
     updated_at TIMESTAMP DEFAULT NOW(),
     is_active BOOLEAN DEFAULT true,
     subscription JSONB
   );
   ```

3. **점진적 마이그레이션**
   - 읽기 작업부터 DB로 이전
   - 쓰기 작업을 DB와 GitHub 양쪽에 수행
   - 검증 후 GitHub 저장소 비활성화

## 🔍 트러블슈팅

### 일반적인 문제들

1. **403 Forbidden 에러**
   - Personal Access Token 권한 확인
   - Repository 이름 및 소유자 확인

2. **404 Not Found 에러**
   - Repository 존재 여부 확인
   - 파일 경로 확인
   - Private Repository 접근 권한 확인

3. **409 Conflict 에러**
   - 파일 SHA 불일치 (동시 수정)
   - 최신 SHA 값으로 재시도

4. **Rate Limit 초과**
   - API 호출 빈도 조절
   - 캐싱 활용
   - 배치 작업으로 최적화

## 📝 모범 사례

1. **파일 크기 관리**: 각 JSON 파일을 1MB 이하로 유지
2. **원자적 작업**: 관련된 데이터 변경을 하나의 커밋으로 처리
3. **에러 처리**: 모든 GitHub API 호출에 적절한 에러 처리
4. **로깅**: API 호출 및 데이터 변경 이력 로깅
5. **백업**: 정기적인 데이터 백업 및 복구 테스트

---

**마지막 업데이트**: 2024년 (GitHub 저장소 연동 구현 완료) 