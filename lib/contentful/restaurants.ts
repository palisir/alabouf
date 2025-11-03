import { contentfulClient, LOCALE } from "./client";
import type { RestaurantSkeleton } from "./types";

export async function getRestaurants(search?: string, tag?: string) {
  return contentfulClient.getEntries<RestaurantSkeleton>({
    content_type: "restaurant",
    locale: LOCALE,
    ...(search && { query: search }),
    ...(tag && { "fields.tags[in]": tag }),
  });
}

export async function getRestaurantById(id: string) {
  return contentfulClient.getEntry<RestaurantSkeleton>(id, { locale: LOCALE });
}

export async function getRestaurantBySlug(slug: string) {
  const response = await contentfulClient.getEntries<RestaurantSkeleton>({
    content_type: "restaurant",
    "fields.slug": slug,
    limit: 1,
    locale: LOCALE,
  });
  return response.items[0] || null;
}
