const axios = require('axios');

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
exports.handler = async function(event, context) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };
  
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight call successful' })
    };
  }
  
  try {
    // Parse request body
    const requestBody = JSON.parse(event.body);
    const { text, purpose = 'general', options = {} } = requestBody;
    
    // Validate input
    if (!text || text.trim() === '') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '텍스트를 입력해주세요.' })
      };
    }
    
    // Get the base prompt for the selected purpose
    const basePrompt = prompts[purpose] || prompts.general;
    
    // Adjust prompt based on options
    const finalPrompt = adjustPromptForOptions(basePrompt, {
      formality: options.formality || 50,
      conciseness: options.conciseness || 50,
      terminology: options.terminology || 'basic'
    });
    
    // In a real implementation, you would call the Claude API here
    // For MVP, we'll simulate the response to avoid requiring API keys during development
    
    // Mock API call (replace with actual Claude API call in production)
    let response;
    if (process.env.CLAUDE_API_KEY) {
      // Actual Claude API call
      try {
        response = await callClaudeAPI(text, finalPrompt);
      } catch (apiError) {
        console.error('Claude API error:', apiError);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: 'Claude API 호출 중 오류가 발생했습니다.' })
        };
      }
    } else {
      // Mock response for development/demo
      response = mockClaudeResponse(text, purpose);
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '텍스트 최적화 중 오류가 발생했습니다.' })
    };
  }
};

// Function to call Claude API (implement in production)
async function callClaudeAPI(text, prompt) {
  const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
  
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-opus-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `${prompt}\n\nHere is the text to optimize:\n\n${text}`
          }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    // Parse the JSON from Claude's response
    return JSON.parse(response.data.content[0].text);
    
  } catch (error) {
    console.error('Claude API error:', error);
    throw new Error('Claude API 호출 중 오류가 발생했습니다.');
  }
}

// Mock function for development/demo
function mockClaudeResponse(text, purpose) {
  // Example improvements
  const optimized = text
    .replace(/very /g, '')
    .replace(/really /g, '')
    .replace(/just /g, '')
    .replace(/that /g, '')
    .replace(/quite /g, '')
    .replace(/a lot/g, 'significantly');
  
  // Generate mock changes
  const changes = [];
  const words = text.split(' ');
  let position = 0;
  
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > 5 && Math.random() > 0.8) {
      const start = position;
      const end = position + words[i].length;
      const improvedWord = words[i].charAt(0).toUpperCase() + words[i].slice(1);
      
      changes.push({
        type: 'replacement',
        original: words[i],
        optimized: improvedWord,
        reason: '더 명확한 표현으로 개선',
        position: [start, end]
      });
    }
    position += words[i].length + 1; // +1 for the space
  }
  
  // Mock analysis scores based on purpose
  let analysis = {};
  
  switch (purpose) {
    case 'academic':
      analysis = {
        readability: Math.floor(Math.random() * 30) + 70,
        professionalLevel: Math.floor(Math.random() * 20) + 80,
        clarity: Math.floor(Math.random() * 25) + 75,
        relevance: Math.floor(Math.random() * 15) + 85
      };
      break;
    case 'business':
      analysis = {
        readability: Math.floor(Math.random() * 25) + 75,
        professionalLevel: Math.floor(Math.random() * 15) + 85,
        clarity: Math.floor(Math.random() * 20) + 80,
        conciseness: Math.floor(Math.random() * 20) + 80
      };
      break;
    case 'technical':
      analysis = {
        readability: Math.floor(Math.random() * 30) + 70,
        professionalLevel: Math.floor(Math.random() * 10) + 90,
        clarity: Math.floor(Math.random() * 25) + 75,
        accuracy: Math.floor(Math.random() * 15) + 85
      };
      break;
    default: // general
      analysis = {
        readability: Math.floor(Math.random() * 20) + 80,
        clarity: Math.floor(Math.random() * 20) + 80,
        conciseness: Math.floor(Math.random() * 25) + 75,
        relevance: Math.floor(Math.random() * 20) + 80
      };
  }
  
  return {
    optimized,
    changes,
    analysis
  };
} 