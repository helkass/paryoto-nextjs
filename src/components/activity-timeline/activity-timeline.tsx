"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { AlertCircle, Loader2, Calendar } from "lucide-react";
import {
  TimelineEvent,
  ActivityTimelineProps,
} from "@/types/activity-timeline.types";
import { TimelineItem } from "./timeline-item";
import { TimelineSkeleton } from "./timeline-skeleton";
import { TimelineEmpty } from "./timeline-empty";

export function ActivityTimeline({
  events,
  loading = false,
  error = null,
  emptyMessage = "No activities found",
  emptyIcon,
  variant = "default",
  layout = "vertical",
  showUser = true,
  showMetadata = false,
  showActions = true,
  groupByDate = true,
  dateFormat = "dd MMM yyyy",
  filter,
  pagination,
  infiniteScroll,
  onEventClick,
  onUserClick,
  className,
  itemClassName,
  iconClassName,
  titleClassName,
  timeClassName,
  animated = true,
}: ActivityTimelineProps) {
  const [filteredEvents, setFilteredEvents] = React.useState(events);
  const [visibleEvents, setVisibleEvents] = React.useState(events);
  const loaderRef = React.useRef<HTMLDivElement>(null);

  // Apply filters
  React.useEffect(() => {
    let filtered = [...events];

    if (filter?.types && filter.types.length > 0) {
      filtered = filtered.filter(
        (event) => event.type && filter.types?.includes(event.type)
      );
    }

    if (filter?.dateRange) {
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.timestamp);
        return (
          eventDate >= filter.dateRange!.start &&
          eventDate <= filter.dateRange!.end
        );
      });
    }

    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          event.user?.name.toLowerCase().includes(searchLower)
      );
    }

    setFilteredEvents(filtered);
  }, [events, filter]);

  // Handle pagination/load more
  React.useEffect(() => {
    if (pagination) {
      const start = (pagination.currentPage - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      setVisibleEvents(filteredEvents.slice(start, end));
    } else {
      setVisibleEvents(filteredEvents);
    }
  }, [filteredEvents, pagination]);

  // Infinite scroll observer
  React.useEffect(() => {
    if (
      !infiniteScroll?.enabled ||
      !infiniteScroll.hasMore ||
      infiniteScroll.loadingMore
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          infiniteScroll.onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [infiniteScroll]);

  // Group events by date
  const groupedEvents = React.useMemo(() => {
    if (!groupByDate) return null;

    const groups: Record<string, TimelineEvent[]> = {};

    visibleEvents.forEach((event) => {
      const date = format(new Date(event.timestamp), dateFormat, {
        locale: id,
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(event);
    });

    return Object.entries(groups).map(([date, events]) => ({
      date,
      events,
    }));
  }, [visibleEvents, groupByDate, dateFormat]);

  if (loading) {
    return (
      <TimelineSkeleton count={5} variant={variant} className={className} />
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center",
          className
        )}
      >
        <div className="rounded-full bg-destructive/10 p-3 mb-4">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="text-destructive font-medium mb-2">
          Failed to load activities
        </p>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (visibleEvents.length === 0) {
    return (
      <TimelineEmpty
        message={emptyMessage}
        icon={emptyIcon}
        className={className}
      />
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const TimelineWrapper = animated ? motion.div : "div";
  const TimelineListWrapper = animated ? motion.div : "div";

  return (
    <div className={cn("w-full", className)}>
      {/* Header with stats */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Activity Timeline</h3>
          <p className="text-sm text-muted-foreground">
            {filteredEvents.length} activities recorded
          </p>
        </div>
        {pagination && (
          <div className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>
        )}
      </div>

      {/* Timeline content */}
      <TimelineWrapper
        variants={containerVariants}
        initial={animated ? "hidden" : false}
        animate={animated ? "visible" : false}
        className={cn(
          "relative",
          layout === "horizontal" && "flex overflow-x-auto pb-6",
          layout === "alternating" && "space-y-6"
        )}
      >
        {groupByDate ? (
          // Grouped by date view
          <div className="space-y-8">
            {groupedEvents?.map(({ date, events }) => (
              <div key={date} className="relative">
                <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm -mt-2 pt-2 pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {date}
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  {events.map((event) => (
                    <TimelineItem
                      key={event.id}
                      event={event}
                      variant={variant}
                      layout={layout}
                      showUser={showUser}
                      showMetadata={showMetadata}
                      showActions={showActions}
                      onEventClick={onEventClick}
                      onUserClick={onUserClick}
                      className={itemClassName}
                      iconClassName={iconClassName}
                      titleClassName={titleClassName}
                      timeClassName={timeClassName}
                      animated={animated}
                      variants={itemVariants}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Flat view
          <TimelineListWrapper
            className={cn(
              layout === "horizontal" && "flex gap-6",
              layout === "vertical" && "space-y-4",
              layout === "alternating" && "space-y-6"
            )}
          >
            {visibleEvents.map((event, idx) => (
              <TimelineItem
                key={event.id}
                event={event}
                variant={variant}
                layout={layout}
                showUser={showUser}
                showMetadata={showMetadata}
                showActions={showActions}
                onEventClick={onEventClick}
                onUserClick={onUserClick}
                className={itemClassName}
                iconClassName={iconClassName}
                titleClassName={titleClassName}
                timeClassName={timeClassName}
                animated={animated}
                variants={itemVariants}
                index={idx}
              />
            ))}
          </TimelineListWrapper>
        )}

        {/* Infinite scroll loader */}
        {infiniteScroll?.enabled && infiniteScroll.hasMore && (
          <div ref={loaderRef} className="flex justify-center py-4">
            {infiniteScroll.loadingMore && (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            )}
          </div>
        )}

        {/* Pagination controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 text-sm rounded-md border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 text-sm">
              {pagination.currentPage} / {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 text-sm rounded-md border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </TimelineWrapper>
    </div>
  );
}

// Export sub-components
export { TimelineItem } from "./timeline-item";
export { TimelineSkeleton } from "./timeline-skeleton";
export { TimelineFilter } from "./timeline-filter";
export { TimelineEmpty } from "./timeline-empty";
