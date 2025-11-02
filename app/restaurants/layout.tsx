import Map from "../components/Map";
import PanelWithContent from "../components/PanelWithContent";
import { getRestaurants } from "@/lib/contentful/restaurants";

export default async function RestaurantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { items: restaurants } = await getRestaurants();

  return (
    <>
      <Map restaurants={restaurants} />
      <PanelWithContent>
        {children}
      </PanelWithContent>
    </>
  );
}

