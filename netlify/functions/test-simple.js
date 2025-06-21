/**
 * 초간단 테스트 Function
 */
exports.handler = async (event, context) => {
  console.log('🔥 TEST-SIMPLE FUNCTION CALLED!!!');
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      message: '🔥 TEST FUNCTION WORKING!!!',
      method: event.httpMethod,
      path: event.path,
      timestamp: new Date().toISOString()
    })
  };
}; 