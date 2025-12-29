import RestaurantList from "../components/RestaurantList";
import { getRestaurants } from "@/lib/contentful/restaurants";
import { getPreferredLocale } from "@/lib/contentful/locale";
import BackToHomeLink from "@/app/components/BackToHomeLink";

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
        <BackToHomeLink className="text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] hover:underline transition-colors duration-200 inline-flex items-center gap-1" />
      </div>
      <RestaurantList restaurants={restaurants} filterTag={tag} searchQuery={search} />
    </>
  );
}
