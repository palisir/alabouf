import Link from "next/link";
import RestaurantList from "../components/RestaurantList";
import { getRestaurants } from "@/lib/contentful/restaurants";
import { getPreferredLocale } from "@/lib/contentful/locale";

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
  const locale = await getPreferredLocale();
  const { items: restaurants } = await getRestaurants(locale, search, tag);

  return (
    <>
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:underline transition-colors duration-200 inline-flex items-center gap-1"
        >
          ← Retour à l&apos;accueil
        </Link>
      </div>
      <RestaurantList restaurants={restaurants} filterTag={tag} searchQuery={search} />
    </>
  );
}
