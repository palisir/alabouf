import type { Asset } from "contentful";
import { getRestaurants } from "@/lib/contentful/restaurants";
import { getPreferredLocale } from "@/lib/contentful/locale";
import HomeContent from "./components/HomeContent";

export default async function Home() {
  const locale = await getPreferredLocale();
  const { items: restaurants } = await getRestaurants(locale);

  // Filter favorites that have at least one photo
  const favorites = restaurants
    .filter((r) => r.fields.favorite && r.fields.picture && (r.fields.picture as Asset[]).length > 0)
    .slice(0, 6)
    .map((r) => {
      const firstPic = (r.fields.picture as Asset[])[0];
      const url = firstPic.fields?.file?.url;
      return {
        name: r.fields.name,
        slug: r.fields.slug,
        pictureUrl: url ? `https:${url}?w=600&fm=webp&q=80` : "",
      };
    })
    .filter((f) => f.pictureUrl);

  // Extract and deduplicate tags, sorted by frequency
  const tagCounts = new Map<string, number>();
  for (const r of restaurants) {
    if (r.fields.tags) {
      for (const tag of r.fields.tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }
  }
  const allTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));

  return (
    <HomeContent
      favorites={favorites}
      allTags={allTags}
      totalCount={restaurants.length}
    />
  );
}
