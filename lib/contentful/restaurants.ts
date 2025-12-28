import type { Entry } from "contentful";
import { contentfulClient } from "./client";
import { DEFAULT_LOCALE, getLocalizedField, type SupportedLocale } from "./locale";
import type { RestaurantSkeleton } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LocalizedFields = Record<string, Record<string, any> | undefined>;

/**
 * Transforms a localized entry (fetched with locale: '*') to extract
 * field values for the given locale with French fallback.
 */
function transformEntry(
  entry: { sys: unknown; fields: LocalizedFields },
  locale: SupportedLocale
): Entry<RestaurantSkeleton, undefined, string> {
  const f = entry.fields;
  return {
    ...entry,
    fields: {
      name: getLocalizedField(f.name, locale) ?? "",
      slug: getLocalizedField(f.slug, locale) ?? "",
      review: getLocalizedField(f.review, locale),
      location: getLocalizedField(f.location, locale),
      picture: getLocalizedField(f.picture, locale),
      tags: getLocalizedField(f.tags, locale),
      instagram: getLocalizedField(f.instagram, locale),
      favorite: getLocalizedField(f.favorite, locale),
    },
  } as Entry<RestaurantSkeleton, undefined, string>;
}

export async function getRestaurants(
  locale: SupportedLocale = DEFAULT_LOCALE,
  search?: string,
  tag?: string
) {
  const response = await contentfulClient.getEntries<RestaurantSkeleton>({
    content_type: "restaurant",
    ...(search && { query: search }),
    ...(tag && { "fields.tags[in]": tag }),
  });

  return {
    ...response,
    items: (response.items as unknown as { sys: unknown; fields: LocalizedFields }[])
      .map((entry) => transformEntry(entry, locale)),
  };
}

export async function getRestaurantById(
  id: string,
  locale: SupportedLocale = DEFAULT_LOCALE
) {
  const entry = await contentfulClient.getEntry<RestaurantSkeleton>(id);
  return transformEntry(entry as unknown as { sys: unknown; fields: LocalizedFields }, locale);
}

export async function getRestaurantBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
) {
  const response = await contentfulClient.getEntries<RestaurantSkeleton>({
    content_type: "restaurant",
    "fields.slug": slug,
    limit: 1,
  });

  const entry = response.items[0] as unknown as { sys: unknown; fields: LocalizedFields } | undefined;
  return entry ? transformEntry(entry, locale) : null;
}
