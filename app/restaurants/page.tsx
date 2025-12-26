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
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] dark:hover:text-[var(--color-primary-light)] hover:underline transition-colors duration-200 inline-flex items-center gap-1"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
      <RestaurantList restaurants={restaurants} filterTag={tag} searchQuery={search} />
    </>
  );
}
