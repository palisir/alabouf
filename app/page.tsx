import Map from "./components/Map";
import PanelWithContent from "./components/PanelWithContent";
import { getRestaurants } from "@/lib/contentful/restaurants";

export default async function Home() {
  const { items: restaurants } = await getRestaurants();

  return (
    <>
      <Map restaurants={restaurants} />
      <PanelWithContent restaurants={restaurants} />
    </>
  );
}
