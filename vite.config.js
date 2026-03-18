import { defineConfig } from 'vite';

// GitHub Pages project site needs repo subpath; Vercel/Netlify use root "/".
const githubPagesBase = '/korutla_webssite/';

export default defineConfig(({ command }) => {
  const usePagesBase =
    command === 'build' && process.env.GITHUB_PAGES === 'true';
  return {
    base: usePagesBase ? githubPagesBase : '/',
  };
});
