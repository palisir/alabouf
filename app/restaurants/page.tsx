import RestaurantList from "../components/RestaurantList";
import { getRestaurants } from "@/lib/contentful/restaurants";

export default async function RestaurantsPage() {
  const { items: restaurants } = await getRestaurants();

  return <RestaurantList restaurants={restaurants} />;
}
