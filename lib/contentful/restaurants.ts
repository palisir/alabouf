import { contentfulClient, LOCALE } from "./client";
import type { RestaurantSkeleton } from "./types";

export async function getRestaurants() {
  return contentfulClient.getEntries<RestaurantSkeleton>({
    content_type: "restaurant",
    locale: LOCALE,
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
