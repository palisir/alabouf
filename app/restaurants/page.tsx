import Link from "next/link";
import RestaurantList from "../components/RestaurantList";
import { getRestaurants } from "@/lib/contentful/restaurants";

interface RestaurantsPageProps {
  searchParams: Promise<{
    tag?: string;
    search?: string;
  }>;
}

export default async function RestaurantsPage({
  searchParams,
}: RestaurantsPageProps) {
  const { tag, search } = await searchParams;
  const { items: restaurants } = await getRestaurants(search, tag);

  return (
    <>
      <div className="mb-4">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
      <RestaurantList restaurants={restaurants} filterTag={tag} searchQuery={search} />
    </>
  );
}
