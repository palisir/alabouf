import { createClient } from 'contentful';

const baseClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

// Client that fetches all locales in a single request (for locale detection + fallback)
export const contentfulClient = baseClient.withAllLocales;
