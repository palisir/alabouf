"use client";

import Link from "next/link";
import type { Entry } from "contentful";
import type { RestaurantSkeleton } from "@/lib/contentful/types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import type { Document } from "@contentful/rich-text-types";
import { t } from "@lingui/core/macro";

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
    <article className="border-b border-gray-200 pb-6 last:border-b-0 overflow-hidden">
      <div className="flex items-start justify-between gap-3 mb-3 min-w-0">
        <Link href={`/restaurants/${slug}`} className="min-w-0 flex-1">
          <h3 className="text-xl font-semibold text-gray-900 hover:text-(--color-primary) transition-colors duration-200 cursor-pointer wrap-break-word">
            {name}
          </h3>
        </Link>
        {favorite && (
          <span
            className="shrink-0 text-(--color-primary) text-lg font-medium"
            title={t`restaurant.favorite`}
            aria-label={t`restaurant.favoriteAria`}
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
                  ? "bg-(--color-primary) text-white hover:bg-(--color-primary-dark)"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {instagram && (
        <div className="mb-4 overflow-hidden">
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-(--color-primary) hover:text-(--color-primary-dark) hover:underline transition-colors duration-200 break-all"
          >
            {instagram}
          </a>
        </div>
      )}

      {reviewExcerpt && (
        <div className="text-sm mt-4 text-gray-600 leading-relaxed wrap-break-word overflow-hidden">
          {reviewExcerpt}
        </div>
      )}
    </article>
  );
}

