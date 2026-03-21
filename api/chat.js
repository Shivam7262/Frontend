const SARVAM_URL = 'https://api.sarvam.ai/v1/chat/completions';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing SARVAM_API_KEY' });
  }

  try {
    const { messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'messages must be a non-empty array' });
    }

    const upstream = await fetch(SARVAM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-subscription-key': apiKey,
      },
      body: JSON.stringify({
        model: 'sarvam-m',
        max_tokens: 1200,
        messages,
      }),
    });

    const text = await upstream.text();
    let payload;

    try {
      payload = JSON.parse(text);
    } catch {
      payload = { error: text || `Upstream error: ${upstream.status}` };
    }

    return res.status(upstream.status).json(payload);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
