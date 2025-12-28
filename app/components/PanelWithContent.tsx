"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import PanelToggleButton from "./PanelToggleButton";
import { usePanel } from "./PanelContext";
import { ReactNode } from "react";

interface PanelWithContentProps {
  children: ReactNode;
}

export default function PanelWithContent({ children }: PanelWithContentProps) {
  const { isOpen, openPanel, closePanel, togglePanel } = usePanel();
  const pathname = usePathname();
  const router = useRouter();
  const lastPathnameRef = useRef<string>("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Detect if we're on a restaurant detail page
  const isRestaurantDetail = /^\/restaurants\/[^/]+$/.test(pathname);

  // Track panel top position separately to avoid flicker when closing
  // Only update when panel is transitioning from closed to open
  // Using React's "adjusting state during render" pattern
  const [panelTop, setPanelTop] = useState("5rem");
  const [prevIsOpen, setPrevIsOpen] = useState(false);
  
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen && !prevIsOpen) {
      // Panel is opening - capture the correct panelTop
      setPanelTop(isRestaurantDetail ? "40vh" : "5rem");
    }
  }

  // Open panel when navigating to any page (except home), close on home
  useEffect(() => {
    const isHomePage = pathname === "/";

    if (isHomePage) {
      // Close panel and reset ref when navigating to home page
      closePanel();
      lastPathnameRef.current = "";
    } else if (pathname !== lastPathnameRef.current) {
      // Open panel on new navigation to non-home pages
      openPanel();
      lastPathnameRef.current = pathname;
    }
  }, [pathname, openPanel, closePanel]);

  // Reset scroll position when pathname changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [pathname]);

  // Handle toggle button click - navigate to /restaurants on restaurant detail pages
  const handleToggleClick = () => {
    if (isRestaurantDetail && isOpen) {
      router.push("/restaurants");
    } else {
      togglePanel();
    }
  };

  return (
    <>
      <PanelToggleButton isOpen={isOpen} onClick={handleToggleClick} isRestaurantDetail={isRestaurantDetail} />

      <div 
        style={{ top: '.75rem',right: '1rem', left: 'auto', textShadow: '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)' }}
        className="fixed z-60 h-12 flex items-center leading-[48px] text-xl font-semibold text-white"
      >
        alabouf
      </div>
      
      {/* Backdrop overlay for mobile - only on non-restaurant pages */}
      {/* Restaurant detail pages have no backdrop so map clicks pass through */}
      {isOpen && !isRestaurantDetail && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => router.push("/")}
          aria-hidden="true"
        />
      )}
      
      {/* Panel: bottom sheet on mobile, side panel on desktop */}
      <div
      // explicitly set top: restaurant detail pages use 50vh on mobile, others use 5rem
      // panelTop only updates when opening, preventing flicker on close
        style={{ top: panelTop }}
        className={`fixed bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-hidden flex flex-col
          /* Mobile: bottom sheet */
          bottom-0 left-0 right-0 rounded-t-2xl
          /* Desktop: side panel */
          md:top-0! md:left-0 md:right-auto md:bottom-auto md:h-screen md:max-h-none md:w-[33vw] md:max-w-[50vw] md:rounded-none
          ${isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:-translate-x-full"}
        `}
      >
        {/* Panel content */}
        <div ref={scrollContainerRef} className="flex-1 p-6 md:p-8 overflow-y-auto min-h-0">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 pb-6 md:pb-8 pt-4 text-center text-sm text-gray-600 space-x-4 border-t border-gray-100 flex-shrink-0">
          <Link 
            href="/contact" 
            className="hover:text-[var(--color-primary)] transition-colors duration-200"
          >
            contact
          </Link>
          <span className="text-gray-400">•</span>
          <Link 
            href="/mentions-legales" 
            className="hover:text-[var(--color-primary)] transition-colors duration-200"
          >
            mentions légales
          </Link>
        </div>
      </div>
    </>
  );
}
