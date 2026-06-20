const RESTAURANT_DETAIL = /^\/restaurants\/([^/]+)$/;

export function isRestaurantDetail(path: string): boolean {
  return RESTAURANT_DETAIL.test(path);
}

export function restaurantSlugFromPath(path: string): string | undefined {
  return path.match(RESTAURANT_DETAIL)?.[1];
}
