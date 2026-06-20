"use client";

import Image from "next/image";
import Link from "next/link";
import { Trans } from "@lingui/react/macro";

interface FavoriteRestaurant {
  name: string;
  slug: string;
  pictureUrl: string;
}

interface TagItem {
  name: string;
  count: number;
}

interface HomeContentProps {
  favorites: FavoriteRestaurant[];
  allTags: TagItem[];
  totalCount: number;
}

export default function HomeContent({ favorites, allTags, totalCount }: HomeContentProps) {
  return (
    <div className="space-y-8">
      {/* Favorites Photo Mosaic */}
      {favorites.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            <Trans id="home.favorites.title">Nos coups de coeur</Trans>
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {favorites.map((fav) => (
              <Link key={fav.slug} href={`/restaurants/${fav.slug}`} className="group">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                  <Image
                    src={fav.pictureUrl}
                    alt={fav.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <span className="text-white text-sm font-medium leading-tight">
                      {fav.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Tag Explorer */}
      {allTags.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            <Trans id="home.tags.title">Explorer par catégorie</Trans>
          </h2>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => (
              <Link
                key={tag.name}
                href={`/restaurants?tag=${encodeURIComponent(tag.name)}`}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/restaurants"
          className="inline-block px-6 py-3 text-sm font-medium text-white bg-(--color-primary) rounded-xl hover:bg-(--color-primary-dark) transition-colors duration-200"
        >
          <Trans id="home.cta">Voir les {totalCount} restaurants</Trans>
        </Link>
      </div>
    </div>
  );
}
