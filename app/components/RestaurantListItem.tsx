import Link from "next/link";
import type { Entry } from "contentful";
import type { RestaurantSkeleton } from "@/lib/contentful/types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import type { Document } from "@contentful/rich-text-types";

interface RestaurantListItemProps {
  restaurant: Entry<RestaurantSkeleton, undefined, string>;
  filterTag?: string;
  onTagClick: (tag: string) => void;
}

export default function RestaurantListItem({
  restaurant,
  filterTag,
  onTagClick,
}: RestaurantListItemProps) {
  const { name, slug, favorite, instagram, tags, review } = restaurant.fields;

  const reviewExcerpt = review
    ? (() => {
      const plainText = documentToPlainTextString(review as Document);
      const maxLength = 110;
      return plainText.length > maxLength
        ? plainText.slice(0, maxLength).trim() + "..."
        : plainText;
    })()
    : null;

  return (
    <article className="border-b border-gray-200 pb-6 last:border-b-0">
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
              onClick={() => onTagClick(tag)}
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

      {reviewExcerpt && (
        <div className="text-sm mt-3 text-gray-600">
          {reviewExcerpt}
        </div>
      )}
    </article>
  );
}

