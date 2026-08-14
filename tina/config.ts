import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable.
// Cloudflare Pages sets CF_PAGES_BRANCH (not GITHUB_BRANCH/VERCEL_GIT_COMMIT_REF/
// HEAD), so without this the branch always silently fell back to "main" on
// Cloudflare builds -- fine for the production branch, but it would point
// preview deploys on other branches at the wrong Tina Cloud content.
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.CF_PAGES_BRANCH ||
  process.env.HEAD ||
  "main";

// Reusable field shapes -- mirrors the Zod objects in src/content.config.ts.
// Kept as plain field-array constants (rather than Tina "templates") since
// none of these need polymorphic switching, just reuse across the dough/
// inclusions tables and the nutrition/playlist/books-movies lists.

const ingredientRowFields = [
  { type: "string", name: "name", label: "Name", required: true },
  { type: "string", name: "weight", label: "Weight (e.g. \"425 g\")", required: true },
  { type: "string", name: "percent", label: "Baker's %" },
  { type: "boolean", name: "isTotal", label: "Bold as total row?" },
  // Per-inclusion handling note (chill until folding in, pat dry, etc.) --
  // only meaningful for inclusions, leave blank on dough rows.
  { type: "string", name: "notes", label: "Notes (inclusions only)" },
] as const;

const nutritionFactFields = [
  { type: "string", name: "label", label: "Nutrient" },
  { type: "string", name: "amount", label: "Amount" },
] as const;

const vitaminEntryFields = [
  { type: "string", name: "ingredient", label: "Ingredient" },
  { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
] as const;

const nonstandardIngredientFields = [
  { type: "string", name: "ingredient", label: "Ingredient" },
  { type: "string", name: "note", label: "Note", ui: { component: "textarea" } },
] as const;

const playlistTrackFields = [
  { type: "string", name: "artist", label: "Artist" },
  { type: "string", name: "track", label: "Track" },
  { type: "string", name: "album", label: "Album" },
  { type: "number", name: "year", label: "Year" },
] as const;

const bookMovieItemFields = [
  { type: "string", name: "title", label: "Title" },
  { type: "string", name: "note", label: "Note", ui: { component: "textarea" } },
] as const;

export default defineConfig({
  branch,

  // Get this from app.tina.io (TinaCloud free tier -- 2 users, plenty for
  // a one-person site). See the Astro repo's TinaCMS section in CLAUDE.md
  // for the exact registration steps.
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },

  // Frontmatter-only collections: neither collection below declares a field
  // with isBody: true, so Tina never touches the Markdown body beneath the
  // frontmatter delimiter. That's deliberate -- every recipe's body (Tutorial
  // Script, Troubleshooting/FAQ as a raw HTML table, Ingredient History,
  // Bloopers, etc., see content.config.ts) is hand-authored HTML-in-Markdown
  // that Tina's rich-text editor would mangle on round-trip. Tina's /admin
  // form only manages the structured frontmatter fields (the tedious,
  // array-heavy stuff -- dough tables, playlists, nutrition) which is
  // exactly where a form beats hand-editing YAML. Bruce still hand-edits the
  // body sections directly and commits/pushes himself, same as today.
  schema: {
    collections: [
      {
        name: "recipe",
        label: "Recipes",
        path: "src/content/recipes",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "subtitle", label: "Subtitle" },
          { type: "image", name: "heroImage", label: "Hero Image" },
          {
            type: "string",
            name: "section",
            label: "Menu Section",
            description:
              "Bread-type structure decided August 3, 2026 -- Classics vs. Enriched & Sweet is decided by butter/milk dairy enrichment, not sweetness. See CLAUDE.md's 'Recipe menu structure (categories)'.",
            options: [
              { value: "classics", label: "The Classics" },
              { value: "enriched-sweet", label: "Enriched & Sweet" },
              { value: "pastry-lamination", label: "Pastry & Lamination" },
              { value: "discards", label: "Discards" },
              { value: "gluten-free", label: "Gluten Free" },
              { value: "everyday-bakes", label: "Everyday Bakes" },
            ],
          },
          {
            type: "string",
            name: "cardFilePrefix",
            label: "Printable-card filename prefix",
            description:
              "Must match the *_Recipe_Card.pdf / *_Nutrition_Card.pdf / *_Steps_Card.pdf filenames in public/cards/ -- see Scripts/build_cards.py notes in CLAUDE.md.",
          },
          {
            type: "object",
            name: "dough",
            label: "Dough Ingredients",
            list: true,
            fields: [...ingredientRowFields],
          },
          {
            type: "string",
            name: "hydrationSaltNote",
            label: "Hydration & Salt Note",
            ui: { component: "textarea" },
          },
          {
            type: "object",
            name: "inclusions",
            label: "Inclusions",
            list: true,
            fields: [...ingredientRowFields],
          },
          { type: "string", name: "yieldNote", label: "Yield Note" },
          { type: "image", name: "flatlayImage", label: "Ingredient Flat-Lay Photo" },
          { type: "string", name: "flatlayAlt", label: "Flat-Lay Alt Text" },
          { type: "string", name: "ddt", label: "Desired Dough Temp (e.g. \"75-78F (24-26C)\")" },
          {
            type: "object",
            name: "nonstandardIngredients",
            label: "Notes on Nonstandard Ingredients",
            list: true,
            fields: [...nonstandardIngredientFields],
          },
          {
            type: "string",
            name: "nonstandardIngredientsNote",
            label: "Nonstandard Ingredients Note (plain-paragraph fallback)",
            ui: { component: "textarea" },
            description: "Only used when there's nothing nonstandard to list (e.g. John Dough).",
          },
          {
            type: "string",
            name: "nutritionBasis",
            label: "Nutrition Basis",
            ui: { component: "textarea" },
          },
          {
            type: "string",
            name: "nutritionCaveat",
            label: "Nutrition Caveat",
            ui: { component: "textarea" },
          },
          {
            type: "object",
            name: "nutritionFacts",
            label: "Nutrition Facts",
            list: true,
            fields: [...nutritionFactFields],
          },
          {
            type: "object",
            name: "vitamins",
            label: "Notable Vitamins & Minerals",
            list: true,
            fields: [...vitaminEntryFields],
          },
          {
            type: "string",
            name: "nutritionNote",
            label: "Nutrition Closing Note",
            ui: { component: "textarea" },
          },
          { type: "string", name: "equipment", label: "Equipment", list: true },
          {
            type: "object",
            name: "playlist",
            label: "Baking Music Playlist",
            list: true,
            fields: [
              { type: "string", name: "phase", label: "Phase (e.g. \"Bulk Fermentation\")" },
              {
                type: "object",
                name: "tracks",
                label: "Tracks",
                list: true,
                fields: [...playlistTrackFields],
              },
            ],
          },
          {
            type: "object",
            name: "booksMovies",
            label: "Books & Movies",
            list: true,
            fields: [
              { type: "string", name: "groupTitle", label: "Group Title (e.g. \"For the craft\")" },
              {
                type: "object",
                name: "items",
                label: "Items",
                list: true,
                fields: [...bookMovieItemFields],
              },
            ],
          },
          { type: "datetime", name: "publishDate", label: "Publish Date" },
        ],
      },
      {
        name: "sami",
        label: "Sami the Sourdough Sandwich",
        path: "src/content/sami",
        format: "md",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "subtitle", label: "Subtitle" },
          { type: "string", name: "location", label: "Location" },
          {
            type: "string",
            name: "voiceMode",
            label: "Voice Mode",
            description:
              "Pick per-story per Sami_the_Sourdough_Sandwich_Voice_Guide.md -- don't default to the same mode every time.",
            options: ["Wanderer", "Field Notes", "Mischief", "Cozy", "Postcard"],
          },
          { type: "image", name: "heroImage", label: "Hero Image" },
          { type: "string", name: "heroAlt", label: "Hero Alt Text" },
          {
            type: "string",
            name: "closingLine",
            label: "Closing Pun Line",
            ui: { component: "textarea" },
          },
          {
            type: "object",
            name: "mapPin",
            label: "Story-Map Pin",
            fields: [
              { type: "string", name: "emoji", label: "Pin Emoji" },
              { type: "number", name: "lat", label: "Latitude" },
              { type: "number", name: "lon", label: "Longitude" },
            ],
          },
          { type: "datetime", name: "publishDate", label: "Publish Date" },
        ],
      },
    ],
  },
});
