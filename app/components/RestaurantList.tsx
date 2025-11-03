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
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher un restaurant..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Rechercher
          </button>
        </div>
      </form>

      {restaurants.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>
            {searchQuery || filterTag
              ? "Aucun restaurant trouvé avec ces filtres."
              : "Aucun restaurant trouvé."}
          </p>
        </div>
      ) : (
        <>
          {(filterTag || searchQuery) && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                {searchQuery && (
                  <>
                    Recherche : <span className="font-semibold">{searchQuery}</span>
                  </>
                )}
                {searchQuery && filterTag && " · "}
                {filterTag && (
                  <>
                    Filtre : <span className="font-semibold">{filterTag}</span>
                  </>
                )}
                {" · "}
                <Link href="/restaurants" className="underline hover:text-blue-600">
                  Voir tous les restaurants
                </Link>
              </p>
            </div>
          )}

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
  );
}
