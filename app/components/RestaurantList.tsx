"use client";

import type { Entry } from "contentful";
import type { RestaurantSkeleton } from "@/lib/contentful/types";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";

interface RestaurantListProps {
  restaurants: Entry<RestaurantSkeleton, undefined, string>[];
}

export default function RestaurantList({ restaurants }: RestaurantListProps) {
  if (restaurants.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucun restaurant trouvé.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {restaurants.map((restaurant) => {
        const { name, favorite, instagram, tags, review } = restaurant.fields;

        return (
          <article
            key={restaurant.sys.id}
            className="border-b border-gray-200 pb-6 last:border-b-0"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
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
              <div className="text-sm text-gray-700 mt-3 prose prose-sm max-w-none">
                {documentToReactComponents(review as Document)}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
