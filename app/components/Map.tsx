"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import mapboxgl from "mapbox-gl";
import type { Entry } from "contentful";
import type { RestaurantSkeleton } from "@/lib/contentful/types";
import { usePanel } from "./PanelContext";
import { useMapPadding } from "./useMapPadding";

// Montreal default center coordinates
const MONTREAL_CENTER: [number, number] = [-73.5673, 45.5017];

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
  const geolocateControlRef = useRef<mapboxgl.GeolocateControl | null>(null);
  const { isOpen, closePanel } = usePanel();
  const { getPadding } = useMapPadding();
  const isOpenRef = useRef(isOpen);
  const closePanelRef = useRef(closePanel);
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  const router = useRouter();
  const routerRef = useRef(router);

  // Helper to check if on restaurant detail page
  const isRestaurantDetailPage = useCallback((path: string) => {
    return /^\/restaurants\/[^/]+$/.test(path);
  }, []);

  // Update refs when values change, but don't trigger map reload
  useEffect(() => {
    isOpenRef.current = isOpen;
    closePanelRef.current = closePanel;
    pathnameRef.current = pathname;
    routerRef.current = router;
  }, [isOpen, closePanel, pathname, router]);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = process.env
      .NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style,
      center: MONTREAL_CENTER,
      zoom,
      collectResourceTiming: false, // Disable telemetry data collection
    });

    // Add geolocate control (blue dot for user location)
    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 5000,
      },
      trackUserLocation: false,
      showUserHeading: false,
    });
    geolocateControlRef.current = geolocateControl;
    map.addControl(geolocateControl, 'bottom-right');

    mapRef.current = map;

    map.on("load", () => {
      // Load custom marker images (3x PNGs for Retina)
      const markers = [
        { name: "marker-regular", path: "/markers/marker-regular.png" },
        { name: "marker-favorite", path: "/markers/marker-favorite.png" },
      ];

      Promise.all(
        markers.map(
          ({ name, path }) =>
            new Promise<void>((resolve) => {
              map.loadImage(path, (error, image) => {
                if (error) {
                  console.warn(`${name} not found:`, error);
                } else if (image) {
                  map.addImage(name, image, { pixelRatio: 3 });
                }
                resolve();
              });
            })
        )
      ).then(() => {
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

        // Add layer for restaurant markers using custom PNG icons
        map.addLayer({
          id: "restaurants",
          type: "symbol",
          source: "restaurants",
          layout: {
            "icon-image": [
              "case",
              ["get", "favorite"],
              "marker-favorite",
              "marker-regular",
            ],
            "icon-size": 1,
            "icon-anchor": "bottom",
          },
          paint: {
            "icon-opacity": 1,
          },
        });

        // Continue with the rest of the initialization...
        initializeMapFeatures(map, geojson, restaurants);
      });
    });

    function initializeMapFeatures(
      map: mapboxgl.Map,
      geojson: GeoJSON.FeatureCollection<GeoJSON.Point>,
      restaurants: Entry<RestaurantSkeleton, undefined, string>[]
    ) {

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
          // Padding is handled by persistent map.setPadding(), no need to pass it here
          map.flyTo({
            center: coordinates,
            zoom: 16,
            duration: 0,
          });
        }
      } else {
        // Not on restaurant detail page: try to geolocate user
        if (geolocateControlRef.current) {
          // If geolocation fails, fly to Montreal as fallback
          // Check current pathname when error fires - user may have navigated to a restaurant
          geolocateControlRef.current.once("error", () => {
            // Only fly to Montreal if still NOT on a restaurant detail page
            if (!isRestaurantDetailPage(pathnameRef.current)) {
              map.flyTo({
                center: MONTREAL_CENTER,
                zoom,
                duration: 1000,
              });
            }
          });
          geolocateControlRef.current.trigger();
        }
      }

      // Scale up marker on click and center map
      map.on("click", "restaurants", (e) => {
        if (!e.features?.[0]) return;

        const feature = e.features[0];
        const coordinates = (
          feature.geometry as GeoJSON.Point
        ).coordinates.slice() as [number, number];
        const { slug } = feature.properties as {
          slug: string;
        };

        // Navigate to the restaurant detail page
        routerRef.current.push(`/restaurants/${slug}`);

        // Center map on the marker with smooth animation
        // Padding is handled by persistent map.setPadding(), no need to pass it here
        map.flyTo({
          center: coordinates,
          zoom: Math.max(map.getZoom(), 16),
          essential: true,
          duration: 1000,
        });

        // Marker size is handled by the useEffect that watches pathname/isOpen
      });

      // Change cursor on hover
      map.on("mouseenter", "restaurants", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "restaurants", () => {
        map.getCanvas().style.cursor = "";
      });

      // Handle clicks on the map background (not on restaurants)
      map.on("click", (e: mapboxgl.MapMouseEvent) => {
        // Check if click is on a restaurant marker
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["restaurants"],
        });

        // Only handle if not clicking on a restaurant
        if (features.length === 0) {
          const onRestaurantDetail = isRestaurantDetailPage(pathnameRef.current);
          const isMobile = window.innerWidth < 768;
          
          if (onRestaurantDetail && isMobile) {
            // On mobile restaurant detail: navigate to home (closes panel + resets URL)
            routerRef.current.push("/");
          } else {
            // Otherwise: just close the panel
            closePanelRef.current();
          }
        }
      });
    }

    return () => {
      map.remove();
    };
  }, [restaurants, zoom, style, isRestaurantDetailPage]);

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
        // Use jumpTo for immediate centering (not affected by pending geolocation callbacks)
        // Padding is handled by persistent map.setPadding(), no need to pass it here
        mapRef.current.jumpTo({
          center: coordinates,
          zoom: 18,
        });
      }
    }
  }, [pathname, restaurants, isRestaurantDetailPage]);

  // Set persistent map padding based on panel state
  // This makes Mapbox SDK natively understand the visible viewport,
  // so all centering operations automatically work correctly
  useEffect(() => {
    if (!mapRef.current) return;

    const padding = getPadding();
    mapRef.current.setPadding(padding);
    // Note: Don't call easeTo here - it would cancel any ongoing flyTo animations
    // Mapbox handles padding changes natively
  }, [isOpen, getPadding]);

  // Update padding on window resize (since padding is based on viewport dimensions)
  useEffect(() => {
    const handleResize = () => {
      if (!mapRef.current) return;
      mapRef.current.setPadding(getPadding());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getPadding]);

  // Update marker size based on which restaurant is currently open
  useEffect(() => {
    if (!mapRef.current || !mapRef.current.isStyleLoaded()) return;

    const onRestaurantDetail = isRestaurantDetailPage(pathname);
    const restaurantSlugMatch = pathname.match(/^\/restaurants\/([^/]+)$/);
    const activeSlug = onRestaurantDetail && isOpen ? restaurantSlugMatch?.[1] : null;

    // Scale up the active restaurant marker, reset others
    mapRef.current.setLayoutProperty("restaurants", "icon-size", 
      activeSlug
        ? ["case", ["==", ["get", "slug"], activeSlug], 1.2, 1]
        : 1
    );
  }, [pathname, isOpen, isRestaurantDetailPage]);

  return (
    <div
      ref={mapContainerRef}
      className="w-screen h-screen m-0 p-0 relative z-0"
    />
  );
}
