import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import { getRestaurantBySlug } from "@/lib/contentful/restaurants";

interface RestaurantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  const { name, favorite, instagram, tags, review } = restaurant.fields;

  return (
    <article>
      <div className="flex items-start justify-between gap-3 mb-4">
        <h2 className="text-2xl font-semibold text-gray-900">{name}</h2>
        {favorite && (
          <span
            className="flex-shrink-0 text-red-500 text-lg font-medium"
            title="Favori"
            aria-label="Restaurant favori"
          >
            ♥
          </span>
        )}
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {instagram && (
        <div className="mb-4">
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            {instagram}
          </a>
        </div>
      )}

      {review && (
        <div className="text-sm text-gray-700 mt-4 prose prose-sm max-w-none">
          {documentToReactComponents(review as Document)}
        </div>
      )}
    </article>
  );
}
