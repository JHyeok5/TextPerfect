require('dotenv').config();
const axios = require('axios');
const { callClaude } = require('./utils/claude');
const { createResponse } = require('./utils/response');
const { validateRequest } = require('./utils/auth');

// Prompts for different purposes
const prompts = {
  general: `
    You are TextPerfect, an expert text optimizer. Your task is to optimize the provided text for general purposes.
    Make it clear, concise, engaging, and easy to understand. Improve sentence structure, word choice, and tone.
    
    Analyze the text and provide:
    1. An optimized version of the text
    2. A list of changes made with their reasons
    3. An analysis of the text quality on a scale of 0-100 for: readability, clarity, conciseness, and relevance
    
    Format your response as a JSON object with the following structure:
    {
      "optimized": "The optimized text goes here",
      "changes": [
        {
          "type": "replacement|addition|removal",
          "original": "Original text portion",
          "optimized": "Optimized text portion",
          "reason": "Reason for the change",
          "position": [start_index, end_index]
        }
      ],
      "analysis": {
        "readability": 85,
        "clarity": 90,
        "conciseness": 80,
        "relevance": 95
      }
    }
  `,
  
  academic: `
    You are TextPerfect, an expert academic text optimizer. Your task is to optimize the provided text for academic purposes.
    Make it clear, precise, well-structured, and suitable for academic publications. Improve terminology, citations format, and logical flow.
    
    Analyze the text and provide:
    1. An optimized version of the text
    2. A list of changes made with their reasons
    3. An analysis of the text quality on a scale of 0-100 for: readability, professionalLevel, clarity, and relevance
    
    Format your response as a JSON object with the following structure:
    {
      "optimized": "The optimized text goes here",
      "changes": [
        {
          "type": "replacement|addition|removal",
          "original": "Original text portion",
          "optimized": "Optimized text portion",
          "reason": "Reason for the change",
          "position": [start_index, end_index]
        }
      ],
      "analysis": {
        "readability": 85,
        "professionalLevel": 90,
        "clarity": 80,
        "relevance": 95
      }
    }
  `,
  
  business: `
    You are TextPerfect, an expert business text optimizer. Your task is to optimize the provided text for business purposes.
    Make it clear, professional, persuasive, and action-oriented. Improve structure, terminology, and call-to-action elements.
    
    Analyze the text and provide:
    1. An optimized version of the text
    2. A list of changes made with their reasons
    3. An analysis of the text quality on a scale of 0-100 for: readability, professionalLevel, clarity, and conciseness
    
    Format your response as a JSON object with the following structure:
    {
      "optimized": "The optimized text goes here",
      "changes": [
        {
          "type": "replacement|addition|removal",
          "original": "Original text portion",
          "optimized": "Optimized text portion",
          "reason": "Reason for the change",
          "position": [start_index, end_index]
        }
      ],
      "analysis": {
        "readability": 85,
        "professionalLevel": 90,
        "clarity": 80,
        "conciseness": 95
      }
    }
  `,
  
  technical: `
    You are TextPerfect, an expert technical text optimizer. Your task is to optimize the provided text for technical documentation.
    Make it clear, precise, well-structured, and focused on technical accuracy. Improve terminology, examples, and step-by-step explanations.
    
    Analyze the text and provide:
    1. An optimized version of the text
    2. A list of changes made with their reasons
    3. An analysis of the text quality on a scale of 0-100 for: readability, professionalLevel, clarity, and accuracy
    
    Format your response as a JSON object with the following structure:
    {
      "optimized": "The optimized text goes here",
      "changes": [
        {
          "type": "replacement|addition|removal",
          "original": "Original text portion",
          "optimized": "Optimized text portion",
          "reason": "Reason for the change",
          "position": [start_index, end_index]
        }
      ],
      "analysis": {
        "readability": 85,
        "professionalLevel": 90,
        "clarity": 80,
        "accuracy": 95
      }
    }
  `
};

// Function to adjust prompts based on options
const adjustPromptForOptions = (prompt, options) => {
  let adjustedPrompt = prompt;
  
  // Adjust for formality
  if (options.formality < 30) {
    adjustedPrompt += "\nUse a casual, conversational tone.";
  } else if (options.formality >= 70) {
    adjustedPrompt += "\nUse a formal, professional tone.";
  } else {
    adjustedPrompt += "\nUse a balanced, neutral tone.";
  }
  
  // Adjust for conciseness
  if (options.conciseness < 30) {
    adjustedPrompt += "\nProvide detailed explanations and examples.";
  } else if (options.conciseness >= 70) {
    adjustedPrompt += "\nBe very concise and to the point.";
  } else {
    adjustedPrompt += "\nStrike a balance between detail and brevity.";
  }
  
  // Adjust for terminology
  if (options.terminology === 'basic') {
    adjustedPrompt += "\nUse simple terms that are easy for non-experts to understand.";
  } else {
    adjustedPrompt += "\nUse advanced technical terminology appropriate for experts.";
  }
  
  return adjustedPrompt;
};

// Main handler function
exports.handler = async (event, context) => {
  try {
    // POST 메서드만 허용
    if (event.httpMethod !== 'POST') {
      return createResponse(405, { error: 'Method not allowed' });
    }

    // 요청 본문 파싱
    const { text, purpose, options } = JSON.parse(event.body);

    // 입력값 검증
    if (!text || !purpose || !options) {
      return createResponse(400, { error: 'Missing required fields' });
    }
    
    // 문자 수 제한은 상위 플랜에서 해제될 수 있으므로 주석 처리
    // if (text.length > 1000) {
    //   return createResponse(400, {
    //     error: '무료 버전에서는 1000자까지만 처리할 수 있습니다.'
    //   });
    // }

    // Claude API 호출을 위한 프롬프트 생성
    const prompt = generatePrompt(text, purpose, options);

    // Claude API 호출
    const claudeResponse = await callClaude(prompt);
    
    // Claude 응답이 JSON 형식이므로 파싱
    const parsedResponse = JSON.parse(claudeResponse);

    return createResponse(200, parsedResponse);
  } catch (error) {
    console.error('Error in optimize function:', error);
    // 에러에 Claude 관련 정보가 포함될 수 있으므로, 클라이언트에게는 일반적인 메시지를 보냄
    return createResponse(500, { error: 'An internal server error occurred while optimizing text.' });
  }
};

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
1.  Analyze the 'Original Text' and provide scores for 'readability', 'professionalLevel', and 'clarity'. Each score must be an integer between 0 and 100.
2.  Optimize the 'Original Text' based on the following style:
    - Purpose: ${purposeDescriptions[purpose]}
    - Formality: ${formalityLevel}
    - Conciseness: ${concisenessLevel}
    - Terminology: ${terminologyLevel}
3.  Analyze the 'Optimized Text' you just created and provide scores for 'readability', 'professionalLevel', and 'clarity'.

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