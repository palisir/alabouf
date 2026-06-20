import { createClient } from 'contentful';

// Single-locale client. Contentful resolves locale fallback natively
// (the `fr` locale falls back to `en-US`), so no manual per-field picking is needed.
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});
