const apiKey = 'sk_r3k7vuhs_fLU3pwtBN8XIEnWgC2194c3g';

async function testApi() {
  try {
    const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        model: 'sarvam-m',
        max_tokens: 120,
        messages: [
          { role: 'system', content: 'You are an assistant.' },
          { role: 'user', content: 'Hello' },
        ],
      }),
    });

    const data = await response.json();
    console.log('Keys in data:', Object.keys(data));
    if (data.choices) {
      console.log('First choice keys:', Object.keys(data.choices[0]));
      console.log('First choice message:', data.choices[0].message);
    } else {
      console.log('No choices field! Data:', JSON.stringify(data).substring(0, 200));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testApi();
