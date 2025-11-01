'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import type { Entry } from 'contentful'
import type { RestaurantSkeleton } from '@/lib/contentful/types'

interface MapProps {
  restaurants: Entry<RestaurantSkeleton, undefined, string>[]
  center?: [number, number]
  zoom?: number
  style?: string
}

export default function Map({ 
  restaurants,
  center = [-73.5673, 45.5017], 
  zoom = 11,
  style = 'mapbox://styles/mapbox/streets-v12'
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style,
      center,
      zoom,
    })

    mapRef.current = map

    map.on('load', () => {
      // Convert restaurants to GeoJSON format (most efficient for Mapbox)
      const geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
        type: 'FeatureCollection',
        features: restaurants
          .filter(restaurant => restaurant.fields.location)
          .map(restaurant => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [
                restaurant.fields.location!.lon,
                restaurant.fields.location!.lat
              ]
            },
            properties: {
              id: restaurant.sys.id,
              name: restaurant.fields.name,
              favorite: restaurant.fields.favorite || false,
              instagram: restaurant.fields.instagram,
              tags: restaurant.fields.tags || []
            }
          }))
      }

      // Add source
      map.addSource('restaurants', {
        type: 'geojson',
        data: geojson,
        cluster: false
      })

      // Add layer for restaurant markers
      map.addLayer({
        id: 'restaurants',
        type: 'circle',
        source: 'restaurants',
        paint: {
          'circle-radius': 8,
          'circle-color': [
            'case',
            ['get', 'favorite'],
            '#ef4444', // red for favorites
            '#3b82f6'  // blue for regular
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      })

      // Fit map to show all restaurants
      if (geojson.features.length > 0) {
        const bounds = new mapboxgl.LngLatBounds()
        geojson.features.forEach(feature => {
          bounds.extend(feature.geometry.coordinates as [number, number])
        })
        const container = map.getContainer()
        const padding = Math.min(container.offsetWidth, container.offsetHeight) * 0.3
        map.fitBounds(bounds, { padding })
      }

      // Add popup on click
      map.on('click', 'restaurants', (e) => {
        if (!e.features?.[0]) return
        
        const feature = e.features[0]
        const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice() as [number, number]
        const { name, instagram, tags } = feature.properties as { 
          name: string
          instagram?: string
          tags: string[]
        }

        // Ensure popup appears over the correct location
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
        }

        const tagsArray = Array.isArray(tags) ? tags : []
        const tagsHtml = tagsArray.length > 0 
          ? `<p class="text-sm text-gray-600">${tagsArray.join(', ')}</p>` 
          : ''
        
        const instagramHtml = instagram 
          ? `<a href="https://instagram.com/${instagram}" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-600 hover:underline">@${instagram}</a>` 
          : ''

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(`
            <div class="p-2">
              <h3 class="font-bold text-lg">${name}</h3>
              ${tagsHtml}
              ${instagramHtml}
            </div>
          `)
          .addTo(map)
      })

      // Change cursor on hover
      map.on('mouseenter', 'restaurants', () => {
        map.getCanvas().style.cursor = 'pointer'
      })

      map.on('mouseleave', 'restaurants', () => {
        map.getCanvas().style.cursor = ''
      })
    })

    return () => {
      map.remove()
    }
  }, [restaurants, center, zoom, style])

  return <div ref={mapContainerRef} className="w-screen h-screen m-0 p-0" />
}
