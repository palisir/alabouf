"use client";

import { useState } from "react";
import MenuToggleButton from "./MenuToggleButton";
import GlobalPageContent from "./GlobalPageContent";
import { MenuContext } from "./MenuContext";

interface MenuWithContentProps {
  children?: React.ReactNode;
}

export default function MenuWithContent({ children }: MenuWithContentProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <MenuContext.Provider value={{ isOpen, closeMenu }}>
      {children}
      <MenuToggleButton isOpen={isOpen} onClick={toggleMenu} />
      <GlobalPageContent isOpen={isOpen} onClose={closeMenu} />
    </MenuContext.Provider>
  );
}
