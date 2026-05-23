// components/navbar/user-menu.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserMenuItem } from "@/types/navbar.types";
import { cn } from "@/lib/utils";

interface UserMenuProps {
  user: {
    name: string;
    email?: string;
    avatar?: string;
    menuItems?: UserMenuItem[];
  };
  onItemClick?: (item: UserMenuItem) => void;
  className?: string;
}

export function UserMenu({ user, onItemClick, className }: UserMenuProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleItemClick = (item: UserMenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    onItemClick?.(item);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn("flex items-center gap-2 outline-none", className)}
        >
          <Avatar className="h-8 w-8 cursor-pointer">
            {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.menuItems?.map((item) => (
          <React.Fragment key={item.id}>
            {item.divider ? (
              <DropdownMenuSeparator />
            ) : item.href ? (
              <DropdownMenuItem asChild>
                <Link href={item.href} className="cursor-pointer">
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleItemClick(item)}>
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </DropdownMenuItem>
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
