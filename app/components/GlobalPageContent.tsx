"use client";

interface GlobalPageContentProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function GlobalPageContent({
  isOpen,
  onClose,
  children,
}: GlobalPageContentProps) {
  return (
    <>
      {/* Content panel */}
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
          {children || <div className="space-y-4">(Content goes here)</div>}
        </div>
      </div>
    </>
  );
}
