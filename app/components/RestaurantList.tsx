"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Entry } from "contentful";
import type { RestaurantSkeleton } from "@/lib/contentful/types";
import RestaurantListItem from "./RestaurantListItem";

interface RestaurantListProps {
  restaurants: Entry<RestaurantSkeleton, undefined, string>[];
  filterTag?: string;
  searchQuery?: string;
}

export default function RestaurantList({
  restaurants,
  filterTag,
  searchQuery,
}: RestaurantListProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(searchQuery || "");

  const handleTagClick = (tag: string) => {
    router.push(`/restaurants?tag=${encodeURIComponent(tag)}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    if (filterTag) params.set("tag", filterTag);
    router.push(`/restaurants${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="flex flex-col h-full">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher un restaurant..."
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] active:bg-[var(--color-primary-dark)] transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
          >
            Rechercher
          </button>
        </div>
      </form>

      {(filterTag || searchQuery) && restaurants.length > 0 && (
        <div className="mb-6 p-4 bg-[var(--color-primary-light)]/30 dark:bg-[var(--color-primary-dark)]/20 border border-[var(--color-primary-muted)]/40 dark:border-[var(--color-primary-muted)]/30 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {searchQuery && (
              <>
                Recherche : <span className="font-semibold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]">{searchQuery}</span>
              </>
            )}
            {searchQuery && filterTag && " · "}
            {filterTag && (
              <>
                Filtre : <span className="font-semibold text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]">{filterTag}</span>
              </>
            )}
            {" · "}
            <Link href="/restaurants" className="underline hover:text-[var(--color-primary)] dark:hover:text-[var(--color-primary-light)] transition-colors">
              Voir tous les restaurants
            </Link>
          </p>
        </div>
      )}

      <div className="flex-1 space-y-6">
        {restaurants.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-base">
              {searchQuery || filterTag
                ? "Aucun restaurant trouvé avec ces filtres."
                : "Aucun restaurant trouvé."}
            </p>
          </div>
        ) : (
          <>
            {restaurants.map((restaurant) => (
              <RestaurantListItem
                key={restaurant.sys.id}
                restaurant={restaurant}
                filterTag={filterTag}
                onTagClick={handleTagClick}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
