import { contentfulClient } from './client';
import { DEFAULT_LOCALE, toContentfulLocale, type SupportedLocale } from './locale';
import type { StaticPageSkeleton } from './types';

export async function getStaticPages(locale: SupportedLocale = DEFAULT_LOCALE) {
  return contentfulClient.getEntries<StaticPageSkeleton>({
    content_type: 'staticPage',
    locale: toContentfulLocale(locale),
  });
}

export async function getStaticPageBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
) {
  const response = await contentfulClient.getEntries<StaticPageSkeleton>({
    content_type: 'staticPage',
    locale: toContentfulLocale(locale),
    'fields.slug': slug,
    limit: 1,
  });

  return response.items[0] ?? null;
}
