# Publish Korutla — go live in minutes

Your site is **static** after build. Pick **one** method.

---

## Fastest: Netlify Drop (no Git, no CLI)

1. In this folder, run:
   ```bash
   npm install
   npm run build
   ```
2. Open **[app.netlify.com/drop](https://app.netlify.com/drop)** (free account).
3. **Drag the entire `dist` folder** onto the page.
4. You get a live URL like `https://random-name-123.netlify.app`.
5. In **Site settings → Domain management**, set a nicer name (e.g. `korutla.netlify.app`) or add your own domain.

**Updates:** Run `npm run build` again and drag `dist` onto the same site (or use Netlify’s deploy UI).

---

## Netlify from Git (auto-deploy on every push)

1. Push this project to GitHub/GitLab/Bitbucket.
2. **[app.netlify.com](https://app.netlify.com)** → **Add new site** → **Import** your repo.
3. Netlify reads `netlify.toml`: build `npm run build`, publish `dist`.
4. Done — every `git push` redeploys.

---

## Vercel

1. Push to GitHub, then import at **[vercel.com](https://vercel.com)** (or install Vercel CLI).
2. Framework: **Other**, build: `npm run build`, output: `dist` (or rely on `vercel.json`).

---

## Surge (CLI, instant URL)

```bash
npm run build
npx surge dist
```

Follow prompts; you get `something.surge.sh`. Free tier available.

---

## After publishing

- **Business list:** Edit `public/data/businesses.json`, then `npm run build` and redeploy.
- **Custom domain:** Set DNS at your registrar (Netlify/Vercel show exact records).

---

**You are ready when:** `npm run build` completes with no errors and `dist/` contains `index.html`, `assets/`, and `data/businesses.json`.
