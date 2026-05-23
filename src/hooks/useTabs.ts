import { useState, useCallback } from "react";

interface UseTabsOptions {
  defaultTab: string;
  onTabChange?: (tab: string) => void;
}

export function useTabs({ defaultTab, onTabChange }: UseTabsOptions) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      onTabChange?.(tab);
    },
    [onTabChange]
  );

  return {
    activeTab,
    setActiveTab: handleTabChange,
    isActive: (tab: string) => activeTab === tab,
  };
}

export function useTabsWithRouter(defaultTab: string) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", tab);
    window.history.pushState({}, "", url.toString());
  }, []);

  return {
    activeTab,
    setActiveTab: handleTabChange,
    isActive: (tab: string) => activeTab === tab,
  };
}
