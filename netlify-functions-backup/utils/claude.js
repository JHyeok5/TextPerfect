const axios = require('axios');
const { error } = require('./response');

// Claude 프롬프트 템플릿 예시
const PROMPT_TEMPLATES = {
  writingCoach: (text) => `아래 글을 분석하고 개선점을 제안해줘.\n\n${text}`,
  summary: (text) => `아래 글을 3문장으로 요약해줘.\n\n${text}`,
  // ...확장 가능
};

/**
 * Claude API를 호출하는 함수
 * @param {string} prompt 프롬프트 텍스트
 * @returns {Promise<string>} Claude의 응답 텍스트
 */
exports.callClaude = async (prompt) => {
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
  
  if (!CLAUDE_API_KEY) {
    console.error('Claude API key is not configured');
    throw new Error('Claude API key is not configured');
  }

  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Invalid prompt provided');
  }

  try {
    console.log('Calling Claude API with prompt length:', prompt.length);
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet-20240229', // Sonnet이 더 비용 효율적
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        timeout: 30000 // 30초 타임아웃
      }
    );

    if (!response.data || !response.data.content || !Array.isArray(response.data.content)) {
      console.error('Invalid Claude API response structure:', response.data);
      throw new Error('Invalid Claude API response structure');
    }

    const responseText = response.data.content[0].text;
    console.log('Claude API response received, length:', responseText.length);
    
    return responseText;
  } catch (error) {
    console.error('Claude API error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });

    // 특정 오류 타입별 처리
    if (error.response) {
      const status = error.response.status;
      const errorData = error.response.data;
      
      if (status === 401) {
        throw new Error('Claude API authentication failed');
      } else if (status === 429) {
        throw new Error('Claude API rate limit exceeded');
      } else if (status === 400) {
        throw new Error(`Claude API bad request: ${errorData?.error?.message || 'Invalid request'}`);
      } else if (status >= 500) {
        throw new Error('Claude API server error');
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Claude API request timeout');
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Claude API connection failed');
    }

    throw new Error('Claude API call failed');
  }
};

function parseClaudeResponse(data) {
  // Claude 응답에서 실제 텍스트 추출
  if (data && data.content && Array.isArray(data.content)) {
    return data.content.map((c) => c.text).join('\n');
  }
  return '';
}

module.exports = {
  callClaude,
  PROMPT_TEMPLATES,
  parseClaudeResponse,
}; 