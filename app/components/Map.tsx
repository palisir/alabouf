"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import type { Entry } from "contentful";
import type { RestaurantSkeleton } from "@/lib/contentful/types";
import { usePanel } from "./PanelContext";

interface MapProps {
  restaurants: Entry<RestaurantSkeleton, undefined, string>[];
  zoom?: number;
  style?: string;
}

export default function Map({
  restaurants,
  zoom = 11,
  style = "mapbox://styles/alabouf/cmhfp7e88001g01qib2sbedku",
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const { closePanel } = usePanel();
  const closePanelRef = useRef(closePanel);
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const router = useRouter();
  const routerRef = useRef(router);

  // Update refs when values change, but don't trigger map reload
  useEffect(() => {
    closePanelRef.current = closePanel;
    pathnameRef.current = pathname;
    routerRef.current = router;
  }, [closePanel, pathname, router]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env
      .NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style,
      zoom,
      collectResourceTiming: false, // Disable telemetry data collection
    });

    mapRef.current = map;

    map.on("load", () => {
      // Convert restaurants to GeoJSON format (most efficient for Mapbox)
      const geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
        type: "FeatureCollection",
        features: restaurants
          .filter((restaurant) => restaurant.fields.location)
          .map((restaurant) => ({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [
                restaurant.fields.location!.lon,
                restaurant.fields.location!.lat,
              ],
            },
            properties: {
              id: restaurant.sys.id,
              slug: restaurant.fields.slug,
              name: restaurant.fields.name,
              favorite: restaurant.fields.favorite || false,
              instagram: restaurant.fields.instagram,
              tags: restaurant.fields.tags || [],
            },
          })),
      };

      // Add source
      map.addSource("restaurants", {
        type: "geojson",
        data: geojson,
        cluster: false,
      });

      // Add layer for restaurant markers
      map.addLayer({
        id: "restaurants",
        type: "circle",
        source: "restaurants",
        paint: {
          "circle-radius": 8,
          "circle-color": [
            "case",
            ["get", "favorite"],
            "#ef4444", // red for favorites
            "#3b82f6", // blue for regular
          ],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Check if we're on a single restaurant page
      const restaurantSlugMatch = pathnameRef.current.match(
        /^\/restaurants\/([^/]+)$/
      );
      const restaurantSlug = restaurantSlugMatch?.[1];

      if (restaurantSlug) {
        // Find the restaurant by slug and center on it
        const restaurant = restaurants.find(
          (r) => r.fields.slug === restaurantSlug && r.fields.location
        );

        if (restaurant) {
          const coordinates: [number, number] = [
            restaurant.fields.location!.lon,
            restaurant.fields.location!.lat,
          ];
          map.flyTo({
            center: coordinates,
            zoom: 16,
            duration: 0,
          });
        }
      } else if (geojson.features.length > 0) {
        // Fit map to show all restaurants
        const bounds = new mapboxgl.LngLatBounds();
        geojson.features.forEach((feature) => {
          bounds.extend(feature.geometry.coordinates as [number, number]);
        });
        const container = map.getContainer();
        const padding =
          Math.min(container.offsetWidth, container.offsetHeight) * 0.05;
        map.fitBounds(bounds, { padding });
      }

      // Add popup on click and center map on marker
      map.on("click", "restaurants", (e) => {
        if (!e.features?.[0]) return;

        const feature = e.features[0];
        const coordinates = (
          feature.geometry as GeoJSON.Point
        ).coordinates.slice() as [number, number];
        const { name, slug, instagram, tags } = feature.properties as {
          name: string;
          slug: string;
          instagram?: string;
          tags: string[];
        };

        // Navigate to the restaurant detail page
        routerRef.current.push(`/restaurants/${slug}`);

        // Ensure popup appears over the correct location
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Center map on the marker with smooth animation
        map.flyTo({
          center: coordinates,
          zoom: Math.max(map.getZoom(), 16),
          essential: true,
          duration: 1000,
        });

        const tagsArray = Array.isArray(tags) ? tags : [];
        const tagsHtml =
          tagsArray.length > 0
            ? `<p class="text-sm text-gray-600 mt-1">${tagsArray.join(", ")}</p>`
            : "";

        const instagramHtml = instagram
          ? `<a href="https://instagram.com/${instagram}" target="_blank" rel="noopener noreferrer" class="text-sm hover:underline mt-2 inline-block transition-colors" style="color: #D97757;">@${instagram}</a>`
          : "";

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `
            <div class="p-3">
              <h3 class="font-semibold text-lg text-gray-900">${name}</h3>
              ${tagsHtml}
              ${instagramHtml}
            </div>
          `
          )
          .addTo(map);
      });

      // Change cursor on hover
      map.on("mouseenter", "restaurants", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "restaurants", () => {
        map.getCanvas().style.cursor = "";
      });

      // Close panel when clicking on the map background (not on restaurants)
      map.on("click", (e: mapboxgl.MapMouseEvent) => {
        // Check if click is on a restaurant marker
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["restaurants"],
        });

        // Only close panel if not clicking on a restaurant
        if (features.length === 0) {
          closePanelRef.current();
        }
      });
    });

    return () => {
      map.remove();
    };
  }, [restaurants, zoom, style]);

  // Update map center when pathname changes (navigating between restaurants)
  // This handles pathname changes after the map is already loaded
  useEffect(() => {
    if (!mapRef.current) return;

    const restaurantSlugMatch = pathname.match(/^\/restaurants\/([^/]+)$/);
    const restaurantSlug = restaurantSlugMatch?.[1];

    if (restaurantSlug && mapRef.current.isStyleLoaded()) {
      const restaurant = restaurants.find(
        (r) => r.fields.slug === restaurantSlug && r.fields.location
      );

      if (restaurant) {
        const coordinates: [number, number] = [
          restaurant.fields.location!.lon,
          restaurant.fields.location!.lat,
        ];
        mapRef.current.flyTo({
          center: coordinates,
          zoom: 18,
          duration: 1000,
        });
      }
    }
  }, [pathname, restaurants]);

  return (
    <div
      ref={mapContainerRef}
      className="w-screen h-screen m-0 p-0 relative z-0"
    />
  );
}
