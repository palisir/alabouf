import Map from './components/Map'
import { getRestaurants } from '@/lib/contentful/restaurants'

export default async function Home() {
  const { items: restaurants } = await getRestaurants()
  
  return <Map restaurants={restaurants} />
}
