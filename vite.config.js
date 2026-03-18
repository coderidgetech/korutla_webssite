import { defineConfig } from 'vite';

// GitHub Pages project URL: https://<user>.github.io/korutla_webssite/
const repoBase = '/korutla_webssite/';

export default defineConfig(({ command }) => ({
  base: command === 'build' ? repoBase : '/',
}));
