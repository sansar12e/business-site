// Handles the GitHub OAuth login flow for Decap CMS on Cloudflare Pages.
//
// MUST live at: functions/api/[[route]].ts
//
// Two addresses are served:
//   /api/auth      -> sends the visitor to GitHub to approve access
//   /api/callback  -> receives them back and exchanges the code for a token
//
// Requires two environment variables in the Pages project:
//   DECAP_CMS_GITHUB_CLIENT_ID
//   DECAP_CMS_GITHUB_CLIENT_SECRET

interface Env {
  DECAP_CMS_GITHUB_CLIENT_ID?: string;
  DECAP_CMS_GITHUB_CLIENT_SECRET?: string;
}

interface RequestContext {
  request: Request;
  env: Env;
}

interface GitHubTokenResponse {
  access_token?: string;
  error?: string;
  error_description?: string;
}

export async function onRequest(context: RequestContext): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "");

  const clientId = env.DECAP_CMS_GITHUB_CLIENT_ID;
  const clientSecret = env.DECAP_CMS_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response(
      "Server not configured: DECAP_CMS_GITHUB_CLIENT_ID and/or " +
        "DECAP_CMS_GITHUB_CLIENT_SECRET are missing from this deployment.",
      { status: 500, headers: { "Content-Type": "text/plain" } }
    );
  }

  // ---- Part one: send the visitor off to GitHub -------------------------
  if (path.endsWith("/auth")) {
    const callbackUrl = `${url.origin}${path.replace(/\/auth$/, "/callback")}`;

    const authorize = new URL("https://github.com/login/oauth/authorize");
    authorize.searchParams.set("client_id", clientId);
    authorize.searchParams.set("redirect_uri", callbackUrl);
    authorize.searchParams.set("scope", url.searchParams.get("scope") || "repo");
    authorize.searchParams.set("state", crypto.randomUUID());

    return new Response(null, {
      status: 302,
      headers: { Location: authorize.toString() },
    });
  }

  // ---- Part two: GitHub sends them back here with a code ----------------
  if (path.endsWith("/callback")) {
    const code = url.searchParams.get("code");

    if (!code) {
      return new Response(
        "No code provided. This address is only reached after approving " +
          "access on GitHub, so opening it directly will always show this.",
        { status: 400, headers: { "Content-Type": "text/plain" } }
      );
    }

    let data: GitHubTokenResponse;

    try {
      const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "User-Agent": "decap-cms-cloudflare-pages",
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
          }),
        }
      );
      data = (await tokenResponse.json()) as GitHubTokenResponse;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return new Response(`Could not reach GitHub: ${message}`, {
        status: 502,
        headers: { "Content-Type": "text/plain" },
      });
    }

    if (data.error || !data.access_token) {
      const reason = data.error_description || data.error || "unknown error";
      return new Response(`GitHub refused the login: ${reason}`, {
        status: 401,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const payload = JSON.stringify({
      token: data.access_token,
      provider: "github",
    });

    // Hand the token back to the CMS window that opened this popup.
    const html = `<!doctype html>
<html>
  <head><meta charset="utf-8" /><title>Signing in…</title></head>
  <body>
    <p>Signing you in…</p>
    <script>
      (function () {
        function receiveMessage(event) {
          window.opener.postMessage(
            'authorization:github:success:${payload}',
            event.origin
          );
          window.removeEventListener('message', receiveMessage, false);
        }
        window.addEventListener('message', receiveMessage, false);
        window.opener.postMessage('authorizing:github', '*');
      })();
    </script>
  </body>
</html>`;

    return new Response(html, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  return new Response("Not found", { status: 404 });
}
