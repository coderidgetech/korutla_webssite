# Korutla — Town showcase

A single-page site highlighting **Korutla** (కోరుట్ల): history, geography, infrastructure, sacred places, and business & community. Section headings include Telugu (తెలుగు) labels. The business list is loaded from **`public/data/businesses.json`**.

## Publish live (right away)

```bash
npm install
npm run build
```

Then **drag the `dist` folder** onto **[Netlify Drop](https://app.netlify.com/drop)** — you get a public URL in under a minute.  
Full options: **`PUBLISH.md`**.

### GitHub Pages (this repo)

Live site: **https://coderidgetech.github.io/korutla_webssite/** (after you enable Pages below).

1. Push to `main` — workflow **Deploy to GitHub Pages** builds and deploys automatically.
2. **One-time:** GitHub repo → **Settings** → **Pages** → **Build and deployment** → Source: **GitHub Actions** (not “Deploy from a branch”).
3. Wait for the workflow to finish (**Actions** tab). The site URL appears in the workflow summary and under Environments.

If you rename the repo, update `base` in `vite.config.js` (`/korutla_webssite/` → `/new-repo-name/`).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
```

Static files are output to `dist/`. Deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, etc.).

## Credits

- Content summarized from Wikipedia and public sources; verify for official use.
- **Photos:** Wikimedia Commons (temple idols, railway) — CC BY-SA 4.0; Unsplash (hero, geography, business section); **Map:** OpenStreetMap.

## Customize

- **Business list:** Edit `public/data/businesses.json` to add or update institutions and services (name, nameTe, category, description, phone, link, linkLabel).
- **MLA / MP / Municipal chairperson:** Edit `public/data/representatives.json` (add chairperson name & party when known).
- **Content:** Edit `index.html` for text and structure.
- **Hero image:** Replace the background URL in `src/style.css` (`.hero-bg`) with your own Korutla photos.
