"use client";

import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from "react";

interface PanelContextType {
  isOpen: boolean;
  closePanel: () => void;
  openPanel: () => void;
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

  const togglePanel = useCallback(() => setIsOpen(prev => !prev), []);
  const closePanel = useCallback(() => setIsOpen(false), []);
  const openPanel = useCallback(() => setIsOpen(true), []);

  const value = useMemo(() => ({
    isOpen,
    closePanel,
    openPanel,
    togglePanel,
  }), [isOpen, closePanel, openPanel, togglePanel]);

  return (
    <PanelContext.Provider value={value}>
      {children}
    </PanelContext.Provider>
  );
}

export { PanelContext };
