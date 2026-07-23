# Deploying to Cloudflare Pages

Your Astro site is ready to deploy to Cloudflare Pages. Here's how to do it with your admin dashboard.

## Quick Deployment (5 minutes)

### Step 1: Connect Your Repository

1. Go to https://pages.cloudflare.com/
2. Click **"Create a project"** → **"Connect to Git"**
3. Authorize Cloudflare to access your GitHub
4. Select your `business-site` repository
5. Click **"Begin setup"**

### Step 2: Configure Build Settings

Use these settings:

- **Framework preset:** Astro
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Environment variables:** (optional for now)

Click **"Save and deploy"**

### Step 3: Wait for Build

Cloudflare will:
1. Clone your repo
2. Run `npm run build`
3. Deploy the `dist/` folder

You'll get a URL like: `business-site.pages.dev`

---

## Add Your Custom Domain

1. In Cloudflare Pages project settings
2. **Custom domains** → **Add custom domain**
3. Enter your domain (e.g., `yourbusiness.com`)
4. Follow the DNS setup instructions

Your site is now live! 🎉

---

## Enable Admin Dashboard (GitHub OAuth)

To use the admin dashboard on your deployed site:

### Step 1: Create GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** `Your Business Admin`
   - **Homepage URL:** `https://yourdomain.com`
   - **Authorization callback URL:** `https://yourdomain.com/api/auth`
4. Copy **Client ID** and **Client Secret**

### Step 2: Add Environment Variables to Cloudflare

1. Go to your **Cloudflare Pages** project
2. Settings → **Environment variables**
3. Click **"Add variable"**
4. Production environment (required):
   - Name: `DECAP_CMS_GITHUB_CLIENT_ID`
   - Value: (your Client ID)
5. Click **"Encrypt"** → Add another
   - Name: `DECAP_CMS_GITHUB_CLIENT_SECRET`
   - Value: (your Client Secret)
6. Click **"Encrypt"** → **"Save"**

### Step 3: Deploy Functions

Create a file for OAuth handling:

**`functions/api/auth/[...route].ts`**

```typescript
export async function onRequest(context: any) {
  const { request } = context;
  const url = new URL(request.url);
  
  // DecapCMS OAuth callback
  if (url.pathname === "/api/auth") {
    const code = url.searchParams.get("code");
    
    if (!code) {
      return new Response("No code provided", { status: 400 });
    }

    try {
      const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: context.env.DECAP_CMS_GITHUB_CLIENT_ID,
          client_secret: context.env.DECAP_CMS_GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });

      const data = await tokenResponse.json();
      
      if (data.error) {
        return new Response(JSON.stringify(data), { status: 400 });
      }

      // Return token to DecapCMS
      return new Response(JSON.stringify(data));
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), { 
        status: 500 
      });
    }
  }

  return new Response("Not found", { status: 404 });
}
```

### Step 4: Push to GitHub

```bash
git add .
git commit -m "Add admin OAuth function"
git push
```

Cloudflare will:
1. Detect the new `functions/` folder
2. Deploy the OAuth endpoint
3. Make it available at `https://yourdomain.com/api/auth`

### Step 5: Test Admin

1. Visit `https://yourdomain.com/admin`
2. Click **"Login with GitHub"**
3. Authorize the app
4. Start editing!

---

## How Updates Work

After deployment:

1. **Edit in admin** → Dashboard at `/admin`
2. **Click Publish** → Changes commit to GitHub
3. **Auto-rebuild** → Cloudflare detects commit, runs build
4. **Live in seconds** → Your site updates automatically

No manual deploys needed!

---

## Environment Variables Reference

For your Cloudflare Pages project to use admin:

| Name | Value | Where to Get |
|------|-------|-------------|
| `DECAP_CMS_GITHUB_CLIENT_ID` | OAuth Client ID | GitHub Settings → Developer → OAuth Apps |
| `DECAP_CMS_GITHUB_CLIENT_SECRET` | OAuth Secret | Same as above |

⚠️ **Never commit these to Git!** Only add in Cloudflare Dashboard.

---

## Troubleshooting

### Admin shows "Page not found"
- Check you're at `https://yourdomain.com/admin` (not other URL)
- Make sure public/admin files were deployed (check Cloudflare build logs)

### OAuth login fails
- Verify Client ID and Secret in Cloudflare env vars
- Check GitHub OAuth app is created and still valid
- Confirm callback URL is exactly: `https://yourdomain.com/api/auth`

### Functions not deploying
- Make sure file is at `functions/api/auth/[...route].ts`
- Check Cloudflare build logs for TypeScript errors
- Try pushing again if it was a timing issue

### Site doesn't update after editing
- Check Cloudflare Pages build log
- Ensure GitHub webhook is connected (automatic if using GitHub integration)
- Try manual rebuild in Cloudflare Pages dashboard

---

## Cost

Cloudflare Pages pricing:
- ✅ **Unlimited bandwidth** — Free!
- ✅ **Unlimited builds** — Free!
- ✅ **Custom domains** — Free!
- ✅ **Functions** (OAuth) — Free tier available

You can run a professional site on Cloudflare for **$0/month**.

---

## Next Steps

1. ✅ Push repo to GitHub
2. ✅ Connect to Cloudflare Pages
3. ✅ Set up custom domain
4. ✅ Enable GitHub OAuth
5. ✅ Deploy functions
6. ✅ Access admin dashboard

Your site + admin dashboard = fully managed website! 🚀

---

**Need help?**
- Cloudflare Pages docs: https://developers.cloudflare.com/pages/
- Astro docs: https://docs.astro.build/
- DecapCMS docs: https://decapcms.org/
