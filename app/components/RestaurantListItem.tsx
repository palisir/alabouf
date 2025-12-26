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
    <article className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-b-0">
      <div className="flex items-start justify-between gap-3 mb-3">
        <Link href={`/restaurants/${slug}`}>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 hover:text-[var(--color-primary)] transition-colors duration-200 cursor-pointer">
            {name}
          </h3>
        </Link>
        {favorite && (
          <span
            className="flex-shrink-0 text-[var(--color-primary)] text-lg font-medium"
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
            <button
              key={index}
              onClick={() => onTagClick(tag)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors duration-200 ${
                filterTag === tag
                  ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {instagram && (
        <div className="mb-4">
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] dark:hover:text-[var(--color-primary-light)] hover:underline transition-colors duration-200"
          >
            {instagram}
          </a>
        </div>
      )}

      {reviewExcerpt && (
        <div className="text-sm mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
          {reviewExcerpt}
        </div>
      )}
    </article>
  );
}

