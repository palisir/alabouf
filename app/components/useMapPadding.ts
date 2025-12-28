"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";
import mapboxgl from "mapbox-gl";
import { usePanel } from "./PanelContext";

// Desktop panel width as a fraction of viewport width (matches PanelWithContent.tsx: 33vw)
const DESKTOP_PANEL_WIDTH_FRACTION = 0.33;

export function useMapPadding() {
  const { isOpen } = usePanel();
  const pathname = usePathname();

  // Check if on restaurant detail page
  const isRestaurantDetailPage = /^\/restaurants\/[^/]+$/.test(pathname);

  const getPadding = useCallback((): mapboxgl.PaddingOptions => {
    if (typeof window === "undefined" || !isOpen) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }

    const isMobile = window.innerWidth < 768;

    if (isMobile && isRestaurantDetailPage) {
      // Mobile + restaurant detail: panel covers bottom 50% of screen
      return { top: 0, bottom: window.innerHeight / 2, left: 0, right: 0 };
    }

    if (!isMobile) {
      // Desktop: panel is on the left, 33vw wide
      return { top: 0, bottom: 0, left: window.innerWidth * DESKTOP_PANEL_WIDTH_FRACTION, right: 0 };
    }

    // Mobile on non-restaurant-detail pages: panel covers more of the screen
    // but we don't need special padding since user can still see map around edges
    return { top: 0, bottom: 0, left: 0, right: 0 };
  }, [isOpen, isRestaurantDetailPage]);

  return { getPadding, isOpen, isRestaurantDetailPage };
}

