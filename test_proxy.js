const fs = require('fs');
const apiKey = 'sk_r3k7vuhs_fLU3pwtBN8XIEnWgC2194c3g';

const SYSTEM_PROMPT = `You are NextStop AI... (shortened for test)`;

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

    const data = await response.json();
    fs.writeFileSync('response_error.json', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Network Error:', error);
  }
}

testProxy();
