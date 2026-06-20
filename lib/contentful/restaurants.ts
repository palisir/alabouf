import { contentfulClient } from "./client";
import { DEFAULT_LOCALE, toContentfulLocale, type SupportedLocale } from "./locale";
import type { RestaurantSkeleton } from "./types";

export async function getRestaurants(
  locale: SupportedLocale = DEFAULT_LOCALE,
  search?: string,
  tag?: string
) {
  return contentfulClient.getEntries<RestaurantSkeleton>({
    content_type: "restaurant",
    locale: toContentfulLocale(locale),
    ...(search && { query: search }),
    ...(tag && { "fields.tags[in]": tag }),
  });
}

export async function getRestaurantBySlug(
  slug: string,
  locale: SupportedLocale = DEFAULT_LOCALE
) {
  const response = await contentfulClient.getEntries<RestaurantSkeleton>({
    content_type: "restaurant",
    locale: toContentfulLocale(locale),
    "fields.slug": slug,
    limit: 1,
  });

  return response.items[0] ?? null;
}
