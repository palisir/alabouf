"use client";

import { useState, useEffect } from "react";

interface ShareButtonProps {
  title: string;
  url: string;
}

export default function ShareButton({ title, url }: ShareButtonProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);



  const handleShare = async () => {
    try {
      // Convert relative URL to absolute URL for sharing
      const absoluteUrl = url.startsWith("http") 
        ? url 
        : `${window.location.origin}${url}`;

      await navigator.share({
        title: title,
        text: `Découvre ce restaurant : ${title}`,
        url: absoluteUrl,
      });
    } catch (error) {
      // User cancelled or error occurred - silently fail
      if ((error as Error).name !== "AbortError") {
        console.error("Error sharing:", error);
      }
    }
  };

  if (!mounted || typeof navigator === "undefined" || !navigator.share) {
    return null;
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-(--color-primary) text-white hover:bg-(--color-primary-dark) transition-colors duration-200"
      aria-label="Partager ce restaurant"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3v12" />
        <path d="m8 7 4-4 4 4" />
        <path d="M4 14v6h16v-6" />
      </svg>
      Partager
    </button>
  );
}

