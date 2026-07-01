# Team Portal

A corporate landing page powered by [Decap CMS](https://decapcms.org/) and hosted on [GitHub Pages](https://pages.github.com/).

## Features

- ✅ Public landing page with rich text, images, links and file downloads
- ✅ Browser-based CMS editor at `/admin` — no code needed to update content
- ✅ Editor access controlled via GitHub repository permissions
- ✅ All content and uploads stored in this Git repository

## Project Structure

```
tdsgibm-team-portal/
├── admin/
│   ├── index.html          # CMS editor UI
│   └── config.yml          # CMS field definitions
├── content/
│   └── page.md             # Page content (front matter + markdown body)
├── uploads/                # Images and file attachments (managed by CMS)
└── index.html              # Public landing page
```

## Setup Instructions

### 1. Create a GitHub OAuth App

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Fill in the fields:
   - **Application name:** Team Portal CMS (or any name)
   - **Homepage URL:** `https://YOUR_USERNAME.github.io/tdsgibm-team-portal`
   - **Authorization callback URL:** `https://api.netlify.com/auth/callback`
     *(Decap CMS's GitHub backend uses this as its OAuth token exchange endpoint — no Netlify account required)*
3. Click **Register application**
4. Note the **Client ID** and click **Generate a new client secret** — save both

### 2. CMS Backend (already configured)

Decap CMS's `github` backend handles authentication directly via GitHub OAuth. The `admin/config.yml` is already set up correctly — no extra server or account needed:

```yaml
backend:
  name: github
  repo: GeekJenAI/tdsgibm-team-portal
  branch: main
```

### 3. Push to GitHub

```bash
git add .
git commit -m "Migrate to GitHub Pages"
git push origin main
```

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. **Settings → Pages → Source → Deploy from a branch**
3. Set branch to **main**, folder to **/ (root)**
4. Click **Save** — your site will be live at `https://YOUR_USERNAME.github.io/tdsgibm-team-portal`

### 5. Grant Editor Access

Editors log in to `/admin` using their **GitHub account**. They must have **write (push) access** to the repository to save content via the CMS.

To invite an editor:
1. Go to your repo → **Settings → Collaborators → Add people**
2. Enter their GitHub username and set role to **Write**

### 6. Edit Content

Navigate to `https://YOUR_USERNAME.github.io/tdsgibm-team-portal/admin` and click **Login with GitHub**.

## Editing Content

The CMS at `/admin` lets you:

| Field | What it does |
|---|---|
| **Page Title** | Main heading shown in the header |
| **Subtitle** | Subtext shown below the title |
| **Hero Image** | Full-width banner image |
| **Body Content** | Rich text (markdown) — headings, bold, lists, links, code |
| **Links** | List of labelled redirect links shown on the page |
| **File Attachments** | Uploadable files that visitors can download |

## License

Internal use only.
