"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Entry } from "contentful";
import type { RestaurantSkeleton } from "@/lib/contentful/types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";

interface RestaurantListProps {
  restaurants: Entry<RestaurantSkeleton, undefined, string>[];
  filterTag?: string;
}

export default function RestaurantList({
  restaurants,
  filterTag,
}: RestaurantListProps) {
  const router = useRouter();

  const handleTagClick = (tag: string) => {
    router.push(`/restaurants?tag=${encodeURIComponent(tag)}`);
  };

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>
          {filterTag
            ? `Aucun restaurant trouvé avec le tag "${filterTag}".`
            : "Aucun restaurant trouvé."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {filterTag && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            Filtre actif : <span className="font-semibold">{filterTag}</span>
            {" · "}
            <Link href="/restaurants" className="underline hover:text-blue-600">
              Voir tous les restaurants
            </Link>
          </p>
        </div>
      )}

      {restaurants.map((restaurant) => {
        const { name, slug, favorite, instagram, tags, review } =
          restaurant.fields;

        return (
          <article
            key={restaurant.sys.id}
            className="border-b border-gray-200 pb-6 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <Link href={`/restaurants/${slug}`}>
                <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                  {name}
                </h3>
              </Link>
              {favorite && (
                <span
                  className="flex-shrink-0 text-red-500 text-sm font-medium"
                  title="Favori"
                  aria-label="Restaurant favori"
                >
                  ♥
                </span>
              )}
            </div>

            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => handleTagClick(tag)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${filterTag === tag
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {instagram && (
              <div className="mb-3">
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
              <div className="text-sm mt-3 prose prose-sm max-w-none">
                {documentToReactComponents(review as Document)}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
