import { contentfulClient, LOCALE } from './client';
import type { StaticPageSkeleton } from './types';

export async function getStaticPages() {
  return contentfulClient.getEntries<StaticPageSkeleton>({
    content_type: 'staticPage',
    locale: LOCALE,
  });
}

export async function getStaticPageById(id: string) {
  return contentfulClient.getEntry<StaticPageSkeleton>(id, { locale: LOCALE });
}

export async function getStaticPageBySlug(slug: string) {
  const response = await contentfulClient.getEntries<StaticPageSkeleton>({
    content_type: 'staticPage',
    'fields.slug': slug,
    limit: 1,
    locale: LOCALE,
  });
  return response.items[0] || null;
}
