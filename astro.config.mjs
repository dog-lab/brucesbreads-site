import { defineConfig } from 'astro/config';

// TinaCMS is deliberately *not* wired in here as an integration. Bruce's
// Breads uses Tina in plain admin-form mode only (see tina/config.ts) --
// editing recipe/Sami frontmatter through the form at /admin/index.html, no
// click-to-edit on the live page. That admin UI is a self-contained static
// SPA that `tinacms build` writes into public/admin/, so Astro just serves
// it like any other static asset -- no @tinacms/astro integration, no SSR
// adapter, no output: 'server' needed. (An earlier pass at this scaffolded
// the full contextual-editing plumbing -- @tinacms/astro, a Node adapter,
// the tina-island endpoint -- before settling on the simpler form-only
// approach; that scaffold was moved to _tina-scaffold-removed/ for Bruce to
// delete once he's confirmed he doesn't want it.)
export default defineConfig({
  output: 'static',
});
