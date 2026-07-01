/**
 * Cloudflare Worker — GitHub OAuth proxy for Sveltia/Decap CMS
 *
 * Environment variables to set in the Cloudflare dashboard (Settings → Variables):
 *   GITHUB_CLIENT_ID     — from your GitHub OAuth App
 *   GITHUB_CLIENT_SECRET — from your GitHub OAuth App (set as Secret)
 *   ALLOWED_ORIGIN       — e.g. https://tdsgibm-team-portal.pages.dev
 */

const GITHUB_AUTH_URL  = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const SCOPE            = 'repo,user';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url    = new URL(request.url);
  const origin = request.headers.get('Origin') || '';
  const allowedOrigin = typeof ALLOWED_ORIGIN !== 'undefined' ? ALLOWED_ORIGIN : '*';

  const cors = {
    'Access-Control-Allow-Origin':  allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }

  // GET /auth — redirect browser to GitHub login
  if (url.pathname === '/auth') {
    const params = new URLSearchParams({
      client_id:    GITHUB_CLIENT_ID,
      scope:        SCOPE,
      redirect_uri: `${url.origin}/callback`,
      state:        url.searchParams.get('state') || '',
    });
    return Response.redirect(`${GITHUB_AUTH_URL}?${params}`, 302);
  }

  // GET /callback — exchange code for token, pass it back to CMS popup
  if (url.pathname === '/callback') {
    const code  = url.searchParams.get('code');
    const state = url.searchParams.get('state') || '';

    if (!code) {
      return new Response('Missing code', { status: 400 });
    }

    const tokenRes = await fetch(GITHUB_TOKEN_URL, {
      method:  'POST',
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id:     GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri:  `${url.origin}/callback`,
        state,
      }),
    });

    const data = await tokenRes.json();

    if (data.error || !data.access_token) {
      return new Response(`OAuth error: ${data.error_description || data.error}`, { status: 400 });
    }

    const token    = data.access_token;
    const provider = 'github';

    const html = `<!DOCTYPE html><html><body><script>
(function() {
  if (window.opener) {
    window.opener.postMessage(
      'authorization:${provider}:success:' + JSON.stringify({ token: '${token}', provider: '${provider}' }),
      '${allowedOrigin}'
    );
  }
  window.close();
})();
<\/script></body></html>`;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html', ...cors },
    });
  }

  return new Response('Not found', { status: 404 });
}
