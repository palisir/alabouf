import { contentfulClient } from './client';
import type { RestaurantSkeleton } from './types';

export async function getRestaurants() {
  return contentfulClient.getEntries<RestaurantSkeleton>({
    content_type: 'restaurant',
  });
}

export async function getRestaurantById(id: string) {
  return contentfulClient.getEntry<RestaurantSkeleton>(id);
}
