import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tina from '@tinacms/astro/integration';
import { tinaAdminDevRedirect } from '@tinacms/astro/vite';

// https://astro.build/config
// output stays 'static' (the site's original, correct mode) -- Tina's Astro
// integration supports "static-site editing": <TinaIsland> emits its own tiny
// in-iframe bootstrap and doesn't need the whole site server-rendered. Only
// the one editor-refresh endpoint (src/pages/tina-island/[name].ts) opts out
// of prerendering on its own. An adapter is still required (the island
// endpoint needs somewhere to run on demand), just not output: 'server'.
// See https://tina.io/docs/contextual-editing/astro#static-site-editing.
export default defineConfig({
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [tina()],
  vite: {
    plugins: [tinaAdminDevRedirect()],
    ssr: { noExternal: ['@tinacms/astro', '@tinacms/bridge'] },
  },
});
