export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    // In Vercel, API keys should be added in the project's Environment Variables settings
    let API_KEY = process.env.NVIDIA_API_KEY || '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';

    if (body.model === 'google/gemma-4-31b-it') {
      body.model = 'google/gemma-3-27b-it'; // Map to working model since 31b-it hangs
    }

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(errorText, { status: response.status });
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
