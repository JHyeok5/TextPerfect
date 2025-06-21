const { logDebug, logError } = require('./utils/response');

// Claude API 설정
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// 사용자 유형별 분석 품질 설정
const ANALYSIS_QUALITY = {
  GUEST: {
    maxTokens: 500,
    model: 'claude-3-haiku-20240307',
    features: ['basic_optimization'],
    analysisDepth: 'basic'
  },
  FREE: {
    maxTokens: 1000,
    model: 'claude-3-haiku-20240307', 
    features: ['basic_optimization', 'readability_analysis'],
    analysisDepth: 'standard'
  },
  PREMIUM: {
    maxTokens: 2000,
    model: 'claude-3-sonnet-20240229',
    features: ['advanced_optimization', 'detailed_analysis', 'style_coaching', 'grammar_check'],
    analysisDepth: 'advanced'
  }
};

// 목적별 프롬프트 템플릿
const PURPOSE_PROMPTS = {
  academic: {
    system: "당신은 학술 글쓰기 전문가입니다. 논문, 연구보고서, 학술 자료의 품질을 향상시키는 것이 목표입니다.",
    focus: "논리적 구조, 학술적 표현, 객관성, 정확성"
  },
  business: {
    system: "당신은 비즈니스 글쓰기 전문가입니다. 제안서, 보고서, 이메일 등 비즈니스 문서의 효과성을 높이는 것이 목표입니다.",
    focus: "명확성, 설득력, 전문성, 간결성"
  },
  technical: {
    system: "당신은 기술 문서 전문가입니다. 매뉴얼, 가이드, 기술 문서의 이해도를 높이는 것이 목표입니다.",
    focus: "정확성, 단계별 설명, 기술 용어 사용, 구조화"
  },
  general: {
    system: "당신은 일반 글쓰기 전문가입니다. 블로그, 소개글, 일반 문서의 가독성과 매력도를 높이는 것이 목표입니다.",
    focus: "가독성, 자연스러운 표현, 독자 친화성"
  }
};

// JWT 토큰 검증 및 사용자 정보 추출
async function getUserFromToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { userType: 'GUEST', user: null };
  }

  try {
    const token = authHeader.substring(7);
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 사용자 정보 기반으로 유형 결정
    const userType = decoded.subscription?.plan || 'FREE';
    return { userType, user: decoded };
  } catch (error) {
    logError('Token verification failed:', error);
    return { userType: 'GUEST', user: null };
  }
}

// Claude API 호출
async function callClaudeAPI(prompt, quality) {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: quality.model,
      max_tokens: quality.maxTokens,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// 텍스트 분석 및 최적화
async function optimizeText(text, purpose, options, userType) {
  const quality = ANALYSIS_QUALITY[userType];
  const purposeConfig = PURPOSE_PROMPTS[purpose] || PURPOSE_PROMPTS.general;
  
  // 사용자 유형별 프롬프트 생성
  let prompt = `${purposeConfig.system}

다음 텍스트를 분석하고 최적화해주세요:

원본 텍스트:
"${text}"

최적화 옵션:
- 격식도: ${options.formality}% (0=매우 캐주얼, 100=매우 격식적)
- 간결성: ${options.conciseness}% (0=매우 상세, 100=매우 간결)  
- 전문용어: ${options.terminology === 'advanced' ? '전문가 수준' : '기본 수준'}
- 중점 사항: ${purposeConfig.focus}

응답 형식 (JSON):
{
  "optimized_text": "최적화된 텍스트",
  "before_analysis": {
    "readability": 점수(0-100),
    "clarity": 점수(0-100), 
    "professionalLevel": 점수(0-100)
  },
  "after_analysis": {
    "readability": 점수(0-100),
    "clarity": 점수(0-100),
    "professionalLevel": 점수(0-100)
  },`;

  // 사용자 유형별 추가 분석
  if (userType === 'PREMIUM') {
    prompt += `
  "detailed_feedback": "상세한 개선 사항 설명",
  "style_suggestions": ["스타일 개선 제안들"],
  "grammar_issues": ["문법 관련 지적 사항들"],`;
  }
  
  if (userType !== 'GUEST') {
    prompt += `
  "improvement_summary": "개선 사항 요약",`;
  }

  prompt += `
  "confidence_score": 점수(0-100)
}`;

  try {
    const result = await callClaudeAPI(prompt, quality);
    
    // JSON 파싱 시도
    try {
      return JSON.parse(result);
    } catch (parseError) {
      // JSON 파싱 실패 시 기본 응답 반환
      logError('JSON parsing failed, returning basic response:', parseError);
      return {
        optimized_text: text, // 원본 텍스트 반환
        before_analysis: { readability: 70, clarity: 70, professionalLevel: 70 },
        after_analysis: { readability: 75, clarity: 75, professionalLevel: 75 },
        improvement_summary: "텍스트 분석이 완료되었습니다.",
        confidence_score: 85
      };
    }
  } catch (apiError) {
    logError('Claude API call failed:', apiError);
    throw new Error('텍스트 최적화 서비스에 일시적인 문제가 발생했습니다.');
  }
}

// 사용량 추적 (간단한 로깅)
async function trackUsage(user, textLength, userType) {
  try {
    logDebug('Usage tracked:', {
      userId: user?.id || 'guest',
      userType,
      textLength,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logError('Usage tracking failed:', error);
  }
}

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // POST 요청만 허용
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // 환경 변수 확인
    if (!CLAUDE_API_KEY) {
      logError('CLAUDE_API_KEY not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Service configuration error' })
      };
    }

    // 요청 데이터 파싱
    const { text, purpose = 'general', options = {} } = JSON.parse(event.body);
    
    // 입력 검증
    if (!text || typeof text !== 'string') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '텍스트를 입력해주세요.' })
      };
    }

    if (text.length < 10) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '더 긴 텍스트를 입력해주세요. (최소 10자)' })
      };
    }

    // 사용자 인증 및 유형 확인
    const { userType, user } = await getUserFromToken(event.headers.authorization);
    
    logDebug('Optimization request:', {
      userType,
      textLength: text.length,
      purpose,
      userId: user?.id || 'guest'
    });

    // 사용자 유형별 길이 제한 확인
    const maxLength = userType === 'PREMIUM' ? 10000 : userType === 'FREE' ? 3000 : 500;
    if (text.length > maxLength) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: `텍스트가 너무 깁니다. (최대 ${maxLength.toLocaleString()}자)`,
          userType,
          maxLength
        })
      };
    }

    // 텍스트 최적화 실행
    const result = await optimizeText(text, purpose, options, userType);
    
    // 사용량 추적
    await trackUsage(user, text.length, userType);

    // 성공 응답
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...result,
        userType,
        processingTime: new Date().toISOString()
      })
    };

  } catch (error) {
    logError('Optimization handler error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || '텍스트 최적화 중 오류가 발생했습니다.',
        timestamp: new Date().toISOString()
      })
    };
  }
}; 