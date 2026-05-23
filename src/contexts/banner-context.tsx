// contexts/banner-context.tsx
"use client";

import * as React from "react";
import { BannerItem, BannerProps, BannerPosition } from "@/types/banner.types";
import { BannerStack } from "@/components/banner/banner-stack";

interface BannerContextType {
  showBanner: (
    banner: Omit<BannerProps, "onDismiss"> & { id?: string }
  ) => string;
  dismissBanner: (id: string) => void;
  dismissAll: () => void;
  banners: BannerItem[];
}

const BannerContext = React.createContext<BannerContextType | undefined>(
  undefined
);

export function useBanner() {
  const context = React.useContext(BannerContext);
  if (!context) {
    throw new Error("useBanner must be used within BannerProvider");
  }
  return context;
}

interface BannerProviderProps {
  children: React.ReactNode;
  position?: BannerPosition;
  maxBanners?: number;
}

export function BannerProvider({
  children,
  position = "top",
  maxBanners = 3,
}: BannerProviderProps) {
  const [banners, setBanners] = React.useState<BannerItem[]>([]);

  const showBanner = React.useCallback(
    (banner: Omit<BannerProps, "onDismiss"> & { id?: string }) => {
      const id =
        banner.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      setBanners((prev) => {
        const newBanners = [...prev, { ...banner, id }];
        // Limit number of banners
        if (newBanners.length > maxBanners) {
          return newBanners.slice(-maxBanners);
        }
        return newBanners;
      });

      return id;
    },
    [maxBanners]
  );

  const dismissBanner = React.useCallback((id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const dismissAll = React.useCallback(() => {
    setBanners([]);
  }, []);

  const value = React.useMemo(
    () => ({
      showBanner,
      dismissBanner,
      dismissAll,
      banners,
    }),
    [showBanner, dismissBanner, dismissAll, banners]
  );

  return (
    <BannerContext.Provider value={value}>
      {children}
      <BannerStack
        banners={banners}
        onDismiss={dismissBanner}
        position={position}
      />
    </BannerContext.Provider>
  );
}
