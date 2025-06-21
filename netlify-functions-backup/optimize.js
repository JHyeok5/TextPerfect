require('dotenv').config();
const { callClaude } = require('./utils/claude');
const { createResponse } = require('./utils/response');

// 프롬프트 생성 함수
function generatePrompt(text, purpose, options) {
  const purposeDescriptions = {
    academic: '학술적이고 전문적인',
    business: '비즈니스에 적합한 전문적이고 공식적인',
    technical: '기술적이고 명확한',
    general: '일반적이고 이해하기 쉬운'
  };

  const formalityLevel = options.formality > 75 ? '매우 격식있게' :
    options.formality > 50 ? '격식있게' :
    options.formality > 25 ? '보통 수준으로' : '편하게';

  const concisenessLevel = options.conciseness > 75 ? '매우 간결하게' :
    options.conciseness > 50 ? '간결하게' :
    options.conciseness > 25 ? '보통 수준으로' : '자세하게';

  const terminologyLevel = options.terminology === 'advanced' ?
    '전문 용어를 적극 활용하여' : '기본적인 용어를 사용하여';

  return `
You are an expert text analyzer and optimizer. Your task is to analyze a given text, optimize it based on specific criteria, and then analyze the optimized version.

Follow these steps precisely:
1. Analyze the 'Original Text' and provide scores for 'readability', 'professionalLevel', and 'clarity'. Each score must be an integer between 0 and 100.
2. Optimize the 'Original Text' based on the following style:
   - Purpose: ${purposeDescriptions[purpose]}
   - Formality: ${formalityLevel}
   - Conciseness: ${concisenessLevel}
   - Terminology: ${terminologyLevel}
3. Analyze the 'Optimized Text' you just created and provide scores for 'readability', 'professionalLevel', and 'clarity'.

The 'Original Text' is:
---
${text}
---

Provide your response ONLY in the following JSON format. Do not include any text or formatting outside of this JSON object.

{
  "before_analysis": {
    "readability": <score_integer>,
    "professionalLevel": <score_integer>,
    "clarity": <score_integer>
  },
  "optimized_text": "<The optimized text goes here. Preserve line breaks with \\n>",
  "after_analysis": {
    "readability": <score_integer>,
    "professionalLevel": <score_integer>,
    "clarity": <score_integer>
  }
}
`;
}

// Main handler function
exports.handler = async (event, context) => {
  try {
    // CORS preflight 요청 처리
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'OK' });
    }

    // POST 메서드만 허용
    if (event.httpMethod !== 'POST') {
      return createResponse(405, { error: 'Method not allowed' });
    }

    // 요청 본문 파싱
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (parseError) {
      console.error('JSON parsing error:', parseError);
      return createResponse(400, { error: 'Invalid JSON format' });
    }

    const { text, purpose, options } = requestBody;

    // 입력값 검증
    if (!text || typeof text !== 'string' || !text.trim()) {
      return createResponse(400, { error: '텍스트를 입력해주세요.' });
    }

    if (!purpose || typeof purpose !== 'string') {
      return createResponse(400, { error: '목적을 선택해주세요.' });
    }

    if (!options || typeof options !== 'object') {
      return createResponse(400, { error: '옵션 설정이 필요합니다.' });
    }

    // 텍스트 길이 제한 (너무 긴 텍스트는 API 비용 증가)
    if (text.length > 10000) {
      return createResponse(400, { error: '텍스트가 너무 깁니다. 10,000자 이하로 입력해주세요.' });
    }

    console.log('Processing optimization request:', {
      textLength: text.length,
      purpose,
      options
    });

    // Claude API 호출을 위한 프롬프트 생성
    const prompt = generatePrompt(text, purpose, options);

    // Claude API 호출
    const claudeResponse = await callClaude(prompt);
    
    // Claude 응답 파싱
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(claudeResponse);
    } catch (jsonError) {
      console.error('Claude response parsing error:', jsonError);
      console.error('Claude response:', claudeResponse);
      return createResponse(500, { error: '응답 처리 중 오류가 발생했습니다.' });
    }

    // 응답 데이터 검증
    if (!parsedResponse.optimized_text || !parsedResponse.before_analysis || !parsedResponse.after_analysis) {
      console.error('Invalid Claude response structure:', parsedResponse);
      return createResponse(500, { error: '최적화 결과를 처리할 수 없습니다.' });
    }

    console.log('Optimization completed successfully');

    return createResponse(200, parsedResponse);
  } catch (error) {
    console.error('Error in optimize function:', error);
    
    // Claude API 특정 오류 처리
    if (error.message && error.message.includes('Claude API')) {
      return createResponse(503, { error: 'AI 서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.' });
    }
    
    // 일반적인 서버 오류
    return createResponse(500, { error: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }
}; 