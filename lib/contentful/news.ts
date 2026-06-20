import { contentfulClient } from './client';
import { DEFAULT_LOCALE, toContentfulLocale, type SupportedLocale } from './locale';
import type { NewsSkeleton } from './types';

export async function getNews(locale: SupportedLocale = DEFAULT_LOCALE) {
  return contentfulClient.getEntries<NewsSkeleton>({
    content_type: 'news',
    locale: toContentfulLocale(locale),
    order: ['-fields.publishedDate'],
  });
}

export async function getNewsBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
) {
  const response = await contentfulClient.getEntries<NewsSkeleton>({
    content_type: 'news',
    locale: toContentfulLocale(locale),
    'fields.slug': slug,
    limit: 1,
  });

  return response.items[0] ?? null;
}
