import RestaurantList from "../components/RestaurantList";
import { getRestaurants } from "@/lib/contentful/restaurants";

interface RestaurantsPageProps {
  searchParams: Promise<{
    tag?: string;
  }>;
}

export default async function RestaurantsPage({
  searchParams,
}: RestaurantsPageProps) {
  const { items: restaurants } = await getRestaurants();
  const { tag } = await searchParams;

  return <RestaurantList restaurants={restaurants} filterTag={tag} />;
}
