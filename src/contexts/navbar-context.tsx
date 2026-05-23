// contexts/navbar-context.tsx
"use client";

import * as React from "react";

interface NavbarContextType {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  mobileBreakpoint: number;
}

const NavbarContext = React.createContext<NavbarContextType | undefined>(
  undefined
);

export function useNavbar() {
  const context = React.useContext(NavbarContext);
  if (!context) {
    throw new Error("useNavbar must be used within NavbarProvider");
  }
  return context;
}

interface NavbarProviderProps {
  children: React.ReactNode;
  mobileBreakpoint?: number;
}

export function NavbarProvider({
  children,
  mobileBreakpoint = 768,
}: NavbarProviderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <NavbarContext.Provider
      value={{
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        mobileBreakpoint,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
}
