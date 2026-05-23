// components/activity-timeline/timeline-item.tsx
"use client";

import * as React from "react";
import { motion, type TargetAndTransition } from "framer-motion";
import { formatDistanceToNow, format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";
import { TimelineEvent } from "@/types/activity-timeline.types";

const typeIcons = {
  info: AlertCircle,
  success: CheckCircle,
  warning: AlertCircle,
  error: XCircle,
  primary: Clock,
};

const typeColors = {
  info: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  success:
    "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  warning:
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  error: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  primary: "bg-primary/10 text-primary",
};

const statusColors = {
  pending:
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400",
  completed:
    "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
  failed: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  "in-progress":
    "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
};

interface TimelineItemProps {
  event: TimelineEvent;
  variant?: "default" | "compact" | "detailed" | "modern";
  layout?: "vertical" | "horizontal" | "alternating";
  showUser?: boolean;
  showMetadata?: boolean;
  showActions?: boolean;
  onEventClick?: (event: TimelineEvent) => void;
  onUserClick?: (user: TimelineEvent["user"]) => void;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  timeClassName?: string;
  animated?: boolean;
  variants?: Record<string, TargetAndTransition>;
  index?: number;
}

export function TimelineItem({
  event,
  variant = "default",
  layout = "vertical",
  showUser = true,
  showMetadata = false,
  showActions = true,
  onEventClick,
  onUserClick,
  className,
  iconClassName,
  titleClassName,
  timeClassName,
  animated = true,
  variants,
  index,
}: TimelineItemProps) {
  const IconComponent = event.type ? typeIcons[event.type] : Clock;
  const typeColor = event.type ? typeColors[event.type] : typeColors.primary;

  const timeAgo = formatDistanceToNow(new Date(event.timestamp), {
    addSuffix: true,
    locale: id,
  });

  const formattedTime = format(new Date(event.timestamp), "HH:mm", {
    locale: id,
  });
  const formattedDate = format(new Date(event.timestamp), "dd MMM yyyy", {
    locale: id,
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const ItemWrapper = animated && variants ? motion.div : "div";
  const itemProps =
    animated && variants
      ? {
          variants,
          custom: index,
        }
      : {};

  // Compact variant
  if (variant === "compact") {
    return (
      <ItemWrapper {...itemProps} className={cn("group", className)}>
        <div
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
          onClick={() => onEventClick?.(event)}
        >
          <div className={cn("p-1.5 rounded-full shrink-0", typeColor)}>
            <IconComponent className="h-3 w-3" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{event.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{timeAgo}</p>
          </div>
          {showActions && event.actions && event.actions.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {event.actions.map((action, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    onClick={() => action.onClick(event)}
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </ItemWrapper>
    );
  }

  // Modern variant
  if (variant === "modern") {
    return (
      <ItemWrapper {...itemProps}>
        <div
          className="relative pl-8 pb-8 last:pb-0 group cursor-pointer"
          onClick={() => onEventClick?.(event)}
        >
          {/* Timeline line */}
          <div className="absolute left-3 top-3 bottom-0 w-px bg-border group-last:hidden" />

          {/* Timeline dot */}
          <div
            className={cn(
              "absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background",
              typeColor
            )}
          >
            <IconComponent className="h-3 w-3" />
          </div>

          <div className="bg-card rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className={cn("font-semibold", titleClassName)}>
                  {event.title}
                </h4>
                {event.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeAgo}
                  </span>
                  {event.status && (
                    <span
                      className={cn(
                        "px-1.5 py-0.5 rounded-full text-xs",
                        statusColors[event.status]
                      )}
                    >
                      {event.status}
                    </span>
                  )}
                </div>
              </div>

              {showActions && event.actions && event.actions.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {event.actions.map((action, idx) => (
                      <DropdownMenuItem
                        key={idx}
                        onClick={() => action.onClick(event)}
                      >
                        {action.icon && (
                          <span className="mr-2">{action.icon}</span>
                        )}
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {showUser && event.user && (
              <div
                className="mt-3 flex items-center gap-2 pt-3 border-t cursor-pointer hover:bg-muted/50 -mx-1 px-1 py-1 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onUserClick?.(event.user);
                }}
              >
                <Avatar className="h-6 w-6">
                  {event.user.avatar && <AvatarImage src={event.user.avatar} />}
                  <AvatarFallback className="text-xs">
                    {getInitials(event.user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium">{event.user.name}</p>
                  {event.user.email && (
                    <p className="text-xs text-muted-foreground">
                      {event.user.email}
                    </p>
                  )}
                </div>
              </div>
            )}

            {showMetadata &&
              event.metadata &&
              Object.keys(event.metadata).length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(event.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground">{key}:</span>
                        <span className="font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </ItemWrapper>
    );
  }

  // Detailed variant
  if (variant === "detailed") {
    return (
      <ItemWrapper {...itemProps}>
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded-full", typeColor)}>
                  <IconComponent className={cn("h-4 w-4", iconClassName)} />
                </div>
                <div>
                  <h4 className={cn("font-semibold", titleClassName)}>
                    {event.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formattedTime}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formattedDate}
                    </span>
                    {event.status && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded-full",
                            statusColors[event.status]
                          )}
                        >
                          {event.status}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>

            {event.description && (
              <p className="text-sm text-muted-foreground mt-3 ml-11">
                {event.description}
              </p>
            )}

            <div className="ml-11 mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {showUser && event.user && (
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 px-2 py-1 rounded transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUserClick?.(event.user);
                    }}
                  >
                    <Avatar className="h-6 w-6">
                      {event.user.avatar && (
                        <AvatarImage src={event.user.avatar} />
                      )}
                      <AvatarFallback className="text-xs">
                        {getInitials(event.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{event.user.name}</span>
                  </div>
                )}
              </div>

              {showActions && event.actions && event.actions.length > 0 && (
                <div className="flex gap-2">
                  {event.actions.map((action, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      onClick={() => action.onClick(event)}
                    >
                      {action.icon && (
                        <span className="mr-1">{action.icon}</span>
                      )}
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </ItemWrapper>
    );
  }

  // Default variant
  return (
    <ItemWrapper {...itemProps}>
      <div
        className={cn(
          "flex gap-4 group cursor-pointer",
          layout === "horizontal" ? "w-80 flex-col" : "items-start",
          className
        )}
        onClick={() => onEventClick?.(event)}
      >
        {/* Timeline icon */}
        <div className={cn("shrink-0", layout === "horizontal" && "mb-2")}>
          <div className={cn("p-2 rounded-full", typeColor)}>
            <IconComponent className={cn("h-4 w-4", iconClassName)} />
          </div>
          {layout === "vertical" && (
            <div className="w-px h-full bg-border ml-3 mt-2 group-last:hidden" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pb-6">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className={cn("font-medium", titleClassName)}>
                {event.title}
              </h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className={cn("text-xs text-muted-foreground", timeClassName)}
                >
                  {timeAgo}
                </span>
                {event.status && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full",
                      statusColors[event.status]
                    )}
                  >
                    {event.status}
                  </span>
                )}
              </div>
            </div>

            {showActions && event.actions && event.actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {event.actions.map((action, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      onClick={() => action.onClick(event)}
                    >
                      {action.icon && (
                        <span className="mr-2">{action.icon}</span>
                      )}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {event.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {event.description}
            </p>
          )}

          {showUser && event.user && (
            <div
              className="flex items-center gap-2 mt-2 cursor-pointer hover:opacity-70 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onUserClick?.(event.user);
              }}
            >
              <Avatar className="h-5 w-5">
                {event.user.avatar && <AvatarImage src={event.user.avatar} />}
                <AvatarFallback className="text-[10px]">
                  {getInitials(event.user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {event.user.name}
              </span>
            </div>
          )}

          {showMetadata &&
            event.metadata &&
            Object.keys(event.metadata).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(event.metadata).map(([key, value]) => (
                  <span
                    key={key}
                    className="text-xs bg-muted px-2 py-0.5 rounded"
                  >
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            )}
        </div>
      </div>
    </ItemWrapper>
  );
}
