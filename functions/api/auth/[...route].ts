export async function onRequest(context: any) {
  const { request, env } = context;
  const url = new URL(request.url);

  if (url.pathname === '/api/auth') {
    const code = url.searchParams.get('code');
    if (!code) {
      return new Response('No code provided', { status: 400 });
    }

    try {
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.DECAP_CMS_GITHUB_CLIENT_ID,
          client_secret: env.DECAP_CMS_GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const data = await tokenResponse.json();
      if (data.error) {
        return new Response(JSON.stringify(data), { status: 400 });
      }

      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return new Response('Not found', { status: 404 });
}
