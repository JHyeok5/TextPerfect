exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Netlify Functions가 정상 작동합니다! (Force redeploy test)',
      method: event.httpMethod,
      timestamp: new Date().toISOString(),
      testTime: Date.now()
    })
  };
}; 