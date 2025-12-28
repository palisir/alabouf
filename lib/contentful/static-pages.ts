import type { Entry } from 'contentful';
import { contentfulClient } from './client';
import { DEFAULT_LOCALE, getLocalizedField, type SupportedLocale } from './locale';
import type { StaticPageSkeleton } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LocalizedFields = Record<string, Record<string, any> | undefined>;

/**
 * Transforms a localized entry (fetched with locale: '*') to extract
 * field values for the given locale with French fallback.
 */
function transformEntry(
  entry: { sys: unknown; fields: LocalizedFields },
  locale: SupportedLocale
): Entry<StaticPageSkeleton, undefined, string> {
  const f = entry.fields;
  return {
    ...entry,
    fields: {
      title: getLocalizedField(f.title, locale) ?? '',
      slug: getLocalizedField(f.slug, locale) ?? '',
      body: getLocalizedField(f.body, locale)!,
    },
  } as Entry<StaticPageSkeleton, undefined, string>;
}

export async function getStaticPages(locale: SupportedLocale = DEFAULT_LOCALE) {
  const response = await contentfulClient.getEntries<StaticPageSkeleton>({
    content_type: 'staticPage',
  });

  return {
    ...response,
    items: (response.items as unknown as { sys: unknown; fields: LocalizedFields }[])
      .map((entry) => transformEntry(entry, locale)),
  };
}

export async function getStaticPageById(
  id: string,
  locale: SupportedLocale = DEFAULT_LOCALE
) {
  const entry = await contentfulClient.getEntry<StaticPageSkeleton>(id);
  return transformEntry(entry as unknown as { sys: unknown; fields: LocalizedFields }, locale);
}

export async function getStaticPageBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
) {
  const response = await contentfulClient.getEntries<StaticPageSkeleton>({
    content_type: 'staticPage',
    'fields.slug': slug,
    limit: 1,
  });

  const entry = response.items[0] as unknown as { sys: unknown; fields: LocalizedFields } | undefined;
  return entry ? transformEntry(entry, locale) : null;
}
