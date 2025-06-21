/**
 * GitHub Repository를 데이터 저장소로 사용하는 유틸리티
 * 사용자 데이터를 GitHub Private Repository에 JSON 파일로 저장/조회
 */

const { v4: uuidv4 } = require('uuid');

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * GitHub API 요청 헬퍼 함수
 */
async function githubApiRequest(endpoint, method = 'GET', data = null) {
  const url = `${GITHUB_API_BASE}${endpoint}`;
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

/**
 * 파일 내용을 GitHub에서 가져오기
 */
async function getFileContent(filePath) {
  try {
    const endpoint = `/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/contents/${filePath}`;
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

/**
 * 파일 내용을 GitHub에 저장하기
 */
async function saveFileContent(filePath, content, sha = null) {
  const endpoint = `/repos/${process.env.GITHUB_USERNAME}/${process.env.GITHUB_REPO}/contents/${filePath}`;
  
  const data = {
    message: `Update ${filePath}`,
    content: Buffer.from(JSON.stringify(content, null, 2)).toString('base64')
  };

  if (sha) {
    data.sha = sha;
  }

  return await githubApiRequest(endpoint, 'PUT', data);
}

/**
 * 기본 파일 내용 반환
 */
function getDefaultFileContent(filePath) {
  switch (filePath) {
    case 'users.json':
      return { users: [] };
    case 'sessions.json':
      return { sessions: [] };
    case 'stats.json':
      return { stats: { totalUsers: 0, activeUsers: 0, totalOptimizations: 0 } };
    default:
      return {};
  }
}

/**
 * 모든 사용자 데이터 조회
 */
async function getUsersData() {
  const { content } = await getFileContent('users.json');
  return content;
}

/**
 * 사용자 데이터 저장
 */
async function saveUsersData(usersData) {
  const { sha } = await getFileContent('users.json');
  return await saveFileContent('users.json', usersData, sha);
}

/**
 * 이메일로 사용자 찾기
 */
async function findUserByEmail(email) {
  const usersData = await getUsersData();
  return usersData.users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

/**
 * ID로 사용자 찾기
 */
async function findUserById(userId) {
  const usersData = await getUsersData();
  return usersData.users.find(user => user.id === userId);
}

/**
 * 새 사용자 생성
 */
async function createUser(userData) {
  const usersData = await getUsersData();
  
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

  usersData.users.push(newUser);
  await saveUsersData(usersData);
  
  // 통계 업데이트
  await updateStats('userCreated');
  
  return newUser;
}

/**
 * 사용자 정보 업데이트
 */
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

/**
 * 마지막 로그인 시간 업데이트
 */
async function updateLastLogin(userId) {
  return await updateUser(userId, { 
    lastLoginAt: new Date().toISOString() 
  });
}

/**
 * 토큰 블랙리스트 관리
 */
async function addToBlacklist(token) {
  const { content, sha } = await getFileContent('sessions.json');
  
  // sessions 배열이 없으면 생성
  if (!content.sessions) {
    content.sessions = [];
  }
  
  content.sessions.push({
    tokenId: token.substring(0, 10), // 토큰의 일부만 저장 (보안)
    userId: null, // 필요시 사용자 ID 추가
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    isBlacklisted: true
  });
  
  // 만료된 토큰들 정리 (7일 이상 된 것들)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  content.sessions = content.sessions.filter(
    item => new Date(item.createdAt) > sevenDaysAgo
  );

  await saveFileContent('sessions.json', content, sha);
}

/**
 * 토큰이 블랙리스트에 있는지 확인
 */
async function isTokenBlacklisted(token) {
  const { content } = await getFileContent('sessions.json');
  if (!content.sessions) return false;
  
  const tokenId = token.substring(0, 10);
  return content.sessions.some(item => item.tokenId === tokenId && item.isBlacklisted);
}

/**
 * 통계 업데이트
 */
async function updateStats(action) {
  const { content, sha } = await getFileContent('stats.json');
  
  // stats 구조 확인 및 초기화
  if (!content.stats) {
    content.stats = { totalUsers: 0, activeUsers: 0, totalOptimizations: 0 };
  }
  
  switch (action) {
    case 'userCreated':
      content.stats.totalUsers += 1;
      break;
    case 'userLogin':
      content.stats.activeUsers += 1;
      break;
    case 'optimization':
      content.stats.totalOptimizations += 1;
      break;
  }
  
  content.stats.lastUpdated = new Date().toISOString();
  await saveFileContent('stats.json', content, sha);
}

module.exports = {
  getUsersData,
  saveUsersData,
  findUserByEmail,
  findUserById,
  createUser,
  updateUser,
  updateLastLogin,
  addToBlacklist,
  isTokenBlacklisted,
  updateStats
}; 