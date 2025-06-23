import React, { createContext, useContext, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const SidebarContext = createContext({
  isOpen: true,
  toggle: () => {},
});

export function SidebarProvider({ children }) {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
