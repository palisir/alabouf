import Map from "./components/Map";
import PanelWithContent from "./components/PanelWithContent";
import { getRestaurants } from "@/lib/contentful/restaurants";

export default async function Home() {
  const { items: restaurants } = await getRestaurants();

  return (
    <>
      <Map restaurants={restaurants} />
      <PanelWithContent>
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold mb-4">alabouf</h1>
          <p className="text-gray-600">
            On a testé, on a aimé, on partage. Nos restos favoris sur une carte.
          </p>
        </div>
      </PanelWithContent>
    </>
  );
}
