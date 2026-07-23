# DecapCMS Admin Dashboard Setup

Your website now has an admin dashboard powered by **DecapCMS** — a Git-backed CMS that lets you edit your site content through a web interface.

## Quick Start

### Local Development
Your admin dashboard is ready at:
- **http://localhost:4322/admin** (or your dev server URL + `/admin`)

Click on "**Site Settings**" to edit:
- Site name and contact info
- Colors and design
- Hero section
- Services
- Testimonials
- FAQ
- About section
- Social links

Changes are saved directly to `src/config.json` in your repo.

---

## Production Setup (Cloudflare Pages)

Once deployed to Cloudflare Pages, your admin dashboard will be at:
- **https://yourdomain.com/admin**

### Step 1: Create a GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name:** `Your Business Admin`
   - **Homepage URL:** `https://yourdomain.com` (your production domain)
   - **Authorization callback URL:** `https://yourdomain.com/api/auth`
4. Click **"Register application"**
5. You'll get:
   - **Client ID** 
   - **Client Secret** (click "Generate a new client secret")

⚠️ **Keep the Client Secret private!**

### Step 2: Configure Cloudflare Environment Variables

1. Go to your **Cloudflare Pages project**
2. Settings → **Environment variables**
3. Add two variables:
   - `DECAP_CMS_GITHUB_CLIENT_ID` = (your Client ID)
   - `DECAP_CMS_GITHUB_CLIENT_SECRET` = (your Client Secret)

### Step 3: Create Auth Endpoint (Cloudflare Function)

Create a new file:

```
functions/api/auth/[...route].ts
```

With this content:

```typescript
import { getOAuthToken } from "decap-cms-backend-github";

export async function onRequest(context: any) {
  const { request } = context;
  
  return getOAuthToken(
    {
      clientID: context.env.DECAP_CMS_GITHUB_CLIENT_ID,
      clientSecret: context.env.DECAP_CMS_GITHUB_CLIENT_SECRET,
    },
    request
  );
}
```

### Step 4: Deploy

1. Push your changes to GitHub
2. Cloudflare Pages auto-builds and deploys
3. Visit `https://yourdomain.com/admin`
4. Click "Login with GitHub"
5. Authorize the app
6. Start editing!

---

## How It Works

1. **Edit in Dashboard** → Make changes in the admin UI
2. **Save** → Changes commit to your GitHub repo (with a message like "Update site config")
3. **Auto-Deploy** → Cloudflare Pages detects the commit and rebuilds your site
4. **Live** → Your changes are live in seconds

---

## File Structure

```
src/
├── config.json              ← 📝 Data file (edited via dashboard)
├── config.ts                ← Imports config.json
└── ... (other files)

public/admin/
├── index.html               ← Dashboard UI
└── config.yml               ← CMS configuration
```

---

## Editing Content

### Supported Fields
- **Text inputs** — Single-line text
- **Text areas** — Multi-line text  
- **Color picker** — Visual color selection
- **Image uploader** — Upload and manage images
- **List fields** — Add/remove items (services, testimonials, FAQ)
- **Object fields** — Edit nested data

### Images
When you upload images in the dashboard:
- They save to `public/uploads/`
- URLs auto-update in config.json
- Example: `/uploads/client-photo.jpg`

### Making It Live
1. Edit content in dashboard
2. Click **"Publish"**
3. Enter commit message (optional)
4. Cloudflare automatically rebuilds and deploys

---

## Restricting Access

By default, anyone with your GitHub account can access the dashboard. To allow team members:

1. Go to **Collaborators** in your GitHub repo settings
2. Invite team members
3. They'll see the admin link once they have access

---

## Troubleshooting

### Dashboard shows "Not Found"
- Make sure you're at `/admin` (not just `/`)
- Check dev server is running locally

### Login fails
- Verify GitHub OAuth App is created correctly
- Check Client ID and Secret in Cloudflare env vars
- Ensure callback URL matches exactly: `https://yourdomain.com/api/auth`

### Changes don't appear
- Refresh the page
- Check Cloudflare Pages build logs
- Make sure you clicked "Publish" in the dashboard

### Can't upload images
- Check `public/uploads/` folder exists
- Verify write permissions in Cloudflare

---

## Advanced: Custom Fields

You can add more editable sections by modifying `public/admin/config.yml`:

```yaml
- label: Custom Section
  name: customField
  widget: object
  fields:
    - { label: Title, name: title, widget: string }
    - { label: Description, name: description, widget: text }
```

Then update `src/config.json` to include the new field.

---

## Backup & Version Control

Since everything lives in Git:
- ✅ Full version history of all content changes
- ✅ Easy rollback to previous versions
- ✅ See who changed what and when
- ✅ Multiple people can edit (with proper permissions)

---

## Next Steps

1. **Locally**: Test the dashboard at `/admin`
2. **On Cloudflare**: Set up GitHub OAuth (steps above)
3. **Tell your team**: Share the admin URL when deployed
4. **Enjoy**: Edit content without touching code!

---

**Questions?** The DecapCMS docs: https://decapcms.org/docs/intro/
