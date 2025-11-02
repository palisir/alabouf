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
