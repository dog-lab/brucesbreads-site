import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const ingredientRow = z.object({
  name: z.string(),
  weight: z.string(),
  percent: z.string().optional(),
  isTotal: z.boolean().optional(),
});

const timeline = z.object({
  feed: z.string(),
  mix: z.string(),
  bulk: z.string(),
  shape: z.string(),
  proof: z.string(),
  bake: z.string(),
  cool: z.string(),
});

const nutritionFact = z.object({
  label: z.string(),
  amount: z.string(),
});

const vitaminEntry = z.object({
  ingredient: z.string(),
  description: z.string(),
});

const playlistTrack = z.object({
  artist: z.string(),
  track: z.string(),
  album: z.string(),
  year: z.number(),
});

const playlistPhase = z.object({
  phase: z.string(),
  tracks: z.array(playlistTrack),
});

const recipes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recipes' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    heroImage: z.string(),
    section: z.enum(['savory', 'sweet', 'discards']),
    dough: z.array(ingredientRow),
    inclusions: z.array(ingredientRow).default([]),
    yieldNote: z.string(),
    ddt: z.string(),
    timeline: timeline,
    steps: z.array(z.string()),
    nutritionBasis: z.string(),
    nutritionFacts: z.array(nutritionFact),
    vitamins: z.array(vitaminEntry),
    nutritionNote: z.string().optional(),
    playlist: z.array(playlistPhase),
    publishDate: z.date(),
  }),
});

// Sami the Sourdough Sandwich story collection. Each story is one page:
// a short narrative (the markdown body, with inline <figure> images) plus
// a handful of structured frontmatter fields used to drive the title
// block, hero image, and the map/card metadata on story-map.html.
const sami = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/sami' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    location: z.string(),
    // See Sami_the_Sourdough_Sandwich_Voice_Guide.md — pick per story
    // based on destination, not templated across all five.
    voiceMode: z.enum(['Wanderer', 'Field Notes', 'Mischief', 'Cozy', 'Postcard']),
    heroImage: z.string(),
    heroAlt: z.string(),
    // The bold closing pun line, styled distinctly from body copy.
    closingLine: z.string(),
    // Map pin metadata for story-map.html's "Real Map" — kept here so a
    // new story's coordinates travel with the story instead of living
    // only inside the hand-edited SVG.
    mapPin: z.object({
      emoji: z.string(),
      lat: z.number(),
      lon: z.number(),
    }),
    publishDate: z.date(),
  }),
});

export const collections = { recipes, sami };
