"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface PanelContextType {
  isOpen: boolean;
  closePanel: () => void;
  togglePanel: () => void;
}

const PanelContext = createContext<PanelContextType | undefined>(undefined);

export function usePanel() {
  const context = useContext(PanelContext);
  if (context === undefined) {
    throw new Error("usePanel must be used within a PanelProvider");
  }
  return context;
}

interface PanelProviderProps {
  children: ReactNode;
}

export function PanelProvider({ children }: PanelProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => setIsOpen(!isOpen);
  const closePanel = () => setIsOpen(false);

  return (
    <PanelContext.Provider value={{ isOpen, closePanel, togglePanel }}>
      {children}
    </PanelContext.Provider>
  );
}

export { PanelContext };
