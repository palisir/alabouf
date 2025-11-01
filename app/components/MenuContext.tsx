'use client'

import { createContext, useContext } from 'react'

interface MenuContextType {
  isOpen: boolean
  closeMenu: () => void
}

const MenuContext = createContext<MenuContextType | undefined>(undefined)

export function useMenu() {
  const context = useContext(MenuContext)
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider')
  }
  return context
}

export { MenuContext }
