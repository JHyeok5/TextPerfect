const fetch = require('node-fetch');
const { error } = require('./response');

// Claude 프롬프트 템플릿 예시
const PROMPT_TEMPLATES = {
  writingCoach: (text) => `아래 글을 분석하고 개선점을 제안해줘.\n\n${text}`,
  summary: (text) => `아래 글을 3문장으로 요약해줘.\n\n${text}`,
  // ...확장 가능
};

async function callClaude({ prompt, apiKey, model = 'claude-3-opus-20240229', maxTokens = 1024 }) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!res.ok) {
      return error({ code: 'CLAUDE_API_ERROR', message: `Claude API 오류: ${res.statusText}`, status: res.status });
    }
    const data = await res.json();
    return data;
  } catch (e) {
    return error({ code: 'CLAUDE_API_ERROR', message: e.message, status: 500 });
  }
}

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