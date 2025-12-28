"use client";

interface PanelToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
  isRestaurantDetail?: boolean;
}

export default function PanelToggleButton({
  isOpen,
  onClick,
  isRestaurantDetail = false,
}: PanelToggleButtonProps) {
  // Show back arrow on restaurant detail pages when panel is open
  const showBackArrow = isRestaurantDetail && isOpen;

  return (
    <button
      onClick={onClick}
      className="fixed top-4 left-4 z-[100] w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
      aria-label={showBackArrow ? "Back to restaurant list" : isOpen ? "Close panel" : "Open panel"}
      aria-expanded={isOpen}
    >
      {showBackArrow ? (
        <span className="text-xl text-gray-800">←</span>
      ) : (
        <div className="relative w-6 h-5 flex flex-col justify-center">
          <span
            className={`absolute w-full h-0.5 bg-gray-800 transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-0" : "-translate-y-2"
            }`}
          />
          <span
            className={`absolute w-full h-0.5 bg-gray-800 transition-all duration-300 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute w-full h-0.5 bg-gray-800 transition-all duration-300 ${
              isOpen ? "-rotate-45 translate-y-0" : "translate-y-2"
            }`}
          />
        </div>
      )}
    </button>
  );
}
