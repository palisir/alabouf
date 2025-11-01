'use client'

import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'

interface MapProps {
  center?: [number, number]
  zoom?: number
  style?: string
}

export default function Map({ 
  center = [-73.5673, 45.5017], 
  zoom = 11,
  style = 'mapbox://styles/mapbox/streets-v12'
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style,
      center,
      zoom,
    })

    return () => {
      map.remove()
    }
  }, [center, zoom, style])

  return <div ref={mapContainerRef} className="w-screen h-screen m-0 p-0" />
}
