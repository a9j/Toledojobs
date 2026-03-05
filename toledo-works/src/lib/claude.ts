const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

export async function askClaude(prompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.warn('Anthropic API key not configured');
    return 'AI feature temporarily unavailable.';
  }

  try {
    const response = await fetch(CLAUDE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const textBlock = data.content?.find((block: { type: string }) => block.type === 'text');
    return textBlock?.text || 'Unable to generate response.';
  } catch (error) {
    console.error('Claude API error:', error);
    return 'AI feature temporarily unavailable.';
  }
}
