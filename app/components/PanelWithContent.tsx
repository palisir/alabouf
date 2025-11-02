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
      <div
        className={`fixed top-0 left-0 h-full w-[33vw] max-w-[50vw] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Panel header */}
        <div className="py-7">
          <h2 className="text-2xl text-right mr-10">alabouf</h2>
        </div>

        {/* Panel content */}
        <div className="p-6 overflow-y-auto h-[calc(100%-80px)]">
          {children}
          <div className="mt-6 text-center">
            <Link href="/contact">contact</Link>
          </div>
        </div>
      </div>
    </>
  );
}
