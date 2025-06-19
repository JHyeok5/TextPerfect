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
 * @returns {Promise<string>} 최적화된 텍스트
 */
exports.callClaude = async (prompt) => {
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
  
  if (!CLAUDE_API_KEY) {
    throw new Error('Claude API key is not configured');
  }

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-opus-20240229',
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
        }
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Failed to call Claude API');
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