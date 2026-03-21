const fs = require('fs');

const apiKey = 'sk_r3k7vuhs_fLU3pwtBN8XIEnWgC2194c3g';

async function testProxy() {
  try {
    const response = await fetch('http://localhost:5173/sarvam-api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        model: 'sarvam-m',
        max_tokens: 1200,
        messages: [
          { role: 'system', content: 'You are an assistant.' },
          { role: 'assistant', content: 'Hello' },
          { role: 'user', content: 'Hi' },
        ],
      }),
    });

    const text = await response.text();
    fs.writeFileSync('response_error.json', text);
    console.log('Status wrote to file:', response.status);
  } catch (error) {
    console.error('Network Error:', error);
  }
}

testProxy();
