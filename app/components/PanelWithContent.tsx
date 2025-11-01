"use client";

import PanelToggleButton from "./PanelToggleButton";
import { usePanel } from "./PanelContext";
import RestaurantList from "./RestaurantList";
import { RestaurantSkeleton } from "@/lib/contentful/types";
import { Entry } from "contentful";

interface PanelWithContentProps {
  restaurants: Entry<RestaurantSkeleton, undefined, string>[];
}

export default function PanelWithContent({
  restaurants,
}: PanelWithContentProps) {
  const { isOpen, closePanel, togglePanel } = usePanel();

  return (
    <>
      <PanelToggleButton isOpen={isOpen} onClick={togglePanel} />
      <div
        className={`fixed top-0 left-0 h-full w-[33vw] max-w-[50vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Panel header */}
        <div className="py-7">
          <h2 className="text-2xl text-right mr-10">alabouf</h2>
        </div>

        {/* Panel content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">
          <RestaurantList restaurants={restaurants} />
        </div>
      </div>
    </>
  );
}
