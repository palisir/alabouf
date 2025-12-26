"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import PanelToggleButton from "./PanelToggleButton";
import { usePanel } from "./PanelContext";
import { ReactNode } from "react";

interface PanelWithContentProps {
  children: ReactNode;
}

export default function PanelWithContent({ children }: PanelWithContentProps) {
  const { isOpen, openPanel, togglePanel } = usePanel();
  const pathname = usePathname();
  const lastPathnameRef = useRef<string>("");

  // Open panel when navigating to any page (except home)
  useEffect(() => {
    const isHomePage = pathname === "/";

    // Only open if we're not on home page and it's a new navigation (pathname changed)
    if (!isHomePage && pathname !== lastPathnameRef.current) {
      openPanel();
      lastPathnameRef.current = pathname;
    } else if (isHomePage) {
      // Reset the ref when navigating to home page
      lastPathnameRef.current = "";
    }
  }, [pathname, openPanel]);

  return (
    <>
      <PanelToggleButton isOpen={isOpen} onClick={togglePanel} />
      
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={togglePanel}
          aria-hidden="true"
        />
      )}
      
      {/* Panel: bottom sheet on mobile, side panel on desktop */}
      <div
        className={`fixed bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-hidden flex flex-col
          /* Mobile: bottom sheet */
          bottom-0 left-0 right-0 h-[85vh] max-h-[85vh] rounded-t-2xl
          /* Desktop: side panel */
          md:top-0 md:left-0 md:right-auto md:bottom-auto md:h-screen md:max-h-none md:w-[33vw] md:max-w-[50vw] md:rounded-none
          ${isOpen ? "translate-y-0 md:translate-x-0" : "translate-y-full md:-translate-x-full"}
        `}
      >
        {/* Panel header */}
        <div className="py-6 md:py-8 px-6 md:px-10 border-b border-gray-100 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-2xl md:text-2xl font-semibold text-right text-gray-900 dark:text-gray-100">
            alabouf
          </h2>
        </div>

        {/* Panel content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto min-h-0">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 md:px-8 pb-6 md:pb-8 pt-4 text-center text-sm text-gray-600 dark:text-gray-400 space-x-4 border-t border-gray-100 dark:border-gray-700 flex-shrink-0">
          <Link 
            href="/contact" 
            className="hover:text-[var(--color-primary)] transition-colors duration-200"
          >
            contact
          </Link>
          <span className="text-gray-400 dark:text-gray-500">•</span>
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
