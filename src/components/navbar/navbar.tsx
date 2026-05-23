// components/navbar/navbar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { NavbarProvider, useNavbar } from "@/contexts/navbar-context";
import { MobileMenu } from "./mobile-menu";
import { UserMenu } from "./user-menu";
import { NotificationBell } from "./notification-bell";
import { ThemeToggle } from "./theme-toggle";
import { SearchBar } from "./search-bar";
import { NavbarProps, NavbarItem } from "@/types/navbar.types";

function NavbarInner({
  brand,
  items = [],
  user,
  notifications = [],
  onNotificationClick,
  onMarkAllAsRead,
  showSearch = true,
  onSearch,
  searchPlaceholder = "Search...",
  showThemeToggle = true,
  sticky = true,
  transparent = false,
  actions,
  className,
  brandClassName,
  menuClassName,
  onMenuClick,
  onUserMenuClick,
  onThemeToggle,
}: NavbarProps) {
  const { isMobileMenuOpen, setIsMobileMenuOpen, mobileBreakpoint } =
    useNavbar();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    if (!sticky) return;

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sticky]);

  const handleMenuClick = (item: NavbarItem) => {
    if (item.onClick) {
      item.onClick();
    }
    onMenuClick?.(item);
  };

  const renderDesktopMenu = () => {
    return (
      <div
        className={cn("hidden items-center gap-1", menuClassName)}
        style={{ display: "flex" }}
      >
        {items.map((item) => (
          <div key={item.id} className="relative group">
            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                onClick={() => handleMenuClick(item)}
              >
                {item.icon && (
                  <span className="text-muted-foreground">{item.icon}</span>
                )}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            ) : (
              <button
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-muted"
                onClick={() => handleMenuClick(item)}
              >
                {item.icon && (
                  <span className="text-muted-foreground">{item.icon}</span>
                )}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-primary-foreground">
                    {item.badge}
                  </span>
                )}
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          sticky && "sticky",
          transparent
            ? "bg-transparent"
            : cn(
                "border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
                scrolled && "shadow-sm"
              ),
          className
        )}
      >
        <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
          {/* Logo / Brand */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>

            {brand && (
              <Link
                href={brand.href || "/"}
                className={cn(
                  "flex items-center gap-2 font-semibold",
                  brandClassName
                )}
              >
                {brand.logo && <span>{brand.logo}</span>}
                <span className="text-lg">{brand.title}</span>
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          {items.length > 0 && renderDesktopMenu()}

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {showSearch && onSearch && (
              <SearchBar
                onSearch={onSearch}
                placeholder={searchPlaceholder}
                className="hidden md:block w-64"
              />
            )}

            {showThemeToggle && <ThemeToggle />}

            {notifications.length > 0 && (
              <NotificationBell
                notifications={notifications}
                onNotificationClick={onNotificationClick}
                onMarkAllAsRead={onMarkAllAsRead}
              />
            )}

            {user && <UserMenu user={user} onItemClick={onUserMenuClick} />}

            {actions && <div className="ml-2">{actions}</div>}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {items.length > 0 && (
        <MobileMenu items={items} onItemClick={handleMenuClick} />
      )}
    </>
  );
}

export function Navbar(props: NavbarProps) {
  return (
    <NavbarProvider mobileBreakpoint={props.mobileBreakpoint}>
      <NavbarInner {...props} />
    </NavbarProvider>
  );
}
