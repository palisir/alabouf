import type { MetadataRoute } from "next";
import { getRestaurants } from "@/lib/contentful/restaurants";
import { getStaticPages } from "@/lib/contentful/static-pages";
import { DEFAULT_LOCALE } from "@/lib/contentful/locale";

// Use Vercel URL for preview deployments, fallback to production
const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "https://www.alabouf.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Fetch all dynamic content from Contentful
    const [{ items: restaurants }, { items: staticPages }] = await Promise.all([
        getRestaurants(DEFAULT_LOCALE),
        getStaticPages(DEFAULT_LOCALE),
    ]);

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/restaurants`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: new Date(),
            changeFrequency: "yearly",
            priority: 0.5,
        },
    ];

    // Individual restaurant pages
    const restaurantRoutes: MetadataRoute.Sitemap = restaurants.map(
        (restaurant) => ({
            url: `${BASE_URL}/restaurants/${restaurant.fields.slug}`,
            lastModified: new Date(restaurant.sys.updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })
    );

    // Static CMS pages (e.g., about, privacy policy)
    const staticPageRoutes: MetadataRoute.Sitemap = staticPages.map((page) => ({
        url: `${BASE_URL}/${page.fields.slug}`,
        lastModified: new Date(page.sys.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...restaurantRoutes, ...staticPageRoutes];
}
