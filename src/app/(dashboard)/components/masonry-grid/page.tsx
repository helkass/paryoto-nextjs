// app/masonry-grid-demo/page.tsx
"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MasonryGrid } from "@/components/masonry-grid/masonry-grid";
import { DashboardCard } from "@/components/cards/dashboard-card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/tabs/custom-tabs";
import { toast } from "sonner";
import { Heart, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import Image from "next/image";

// Sample image data (using placeholder images)
const sampleImages = [
  {
    id: 1,
    title: "Mountain Landscape",
    author: "John Doe",
    likes: 234,
    image: "https://picsum.photos/id/15/400/500",
  },
  {
    id: 2,
    title: "City Skyline",
    author: "Jane Smith",
    likes: 456,
    image: "https://picsum.photos/id/20/400/300",
  },
  {
    id: 3,
    title: "Beach Sunset",
    author: "Bob Johnson",
    likes: 789,
    image: "https://picsum.photos/id/30/400/400",
  },
  {
    id: 4,
    title: "Forest Trail",
    author: "Alice Brown",
    likes: 123,
    image: "https://picsum.photos/id/40/400/350",
  },
  {
    id: 5,
    title: "Desert Dunes",
    author: "Charlie Wilson",
    likes: 567,
    image: "https://picsum.photos/id/50/400/450",
  },
  {
    id: 6,
    title: "Snow Mountain",
    author: "Diana Prince",
    likes: 890,
    image: "https://picsum.photos/id/60/400/320",
  },
  {
    id: 7,
    title: "Ocean Waves",
    author: "Evan Parker",
    likes: 234,
    image: "https://picsum.photos/id/70/400/380",
  },
  {
    id: 8,
    title: "Night City",
    author: "Fiona Chen",
    likes: 567,
    image: "https://picsum.photos/id/80/400/420",
  },
  {
    id: 9,
    title: "Cherry Blossom",
    author: "George Kim",
    likes: 890,
    image: "https://picsum.photos/id/90/400/360",
  },
  {
    id: 10,
    title: "Waterfall",
    author: "Hannah Lee",
    likes: 123,
    image: "https://picsum.photos/id/100/400/340",
  },
  {
    id: 11,
    title: "Northern Lights",
    author: "Ian Taylor",
    likes: 456,
    image: "https://picsum.photos/id/110/400/390",
  },
  {
    id: 12,
    title: "Volcano",
    author: "Julia Adams",
    likes: 789,
    image: "https://picsum.photos/id/120/400/410",
  },
  {
    id: 13,
    title: "Canyon",
    author: "Kevin Wright",
    likes: 234,
    image: "https://picsum.photos/id/130/400/370",
  },
  {
    id: 14,
    title: "Glacier",
    author: "Laura Martinez",
    likes: 567,
    image: "https://picsum.photos/id/140/400/330",
  },
  {
    id: 15,
    title: "Rainforest",
    author: "Mike Robinson",
    likes: 890,
    image: "https://picsum.photos/id/150/400/430",
  },
];

interface PinCardProps {
  item: (typeof sampleImages)[0];
  index: number;
  onClick?: () => void;
}

function PinCard({ item, index, onClick }: PinCardProps) {
  const [liked, setLiked] = React.useState(false);
  const aspectRatio = React.useMemo(() => {
    // Random aspect ratio for demo (in production, use actual image dimensions)
    const ratios = [
      "aspect-square",
      "aspect-video",
      "aspect-[4/3]",
      "aspect-[3/4]",
      "aspect-[2/3]",
    ];
    return ratios[index % ratios.length];
  }, [index]);

  return (
    <Card className="group overflow-hidden rounded-xl transition-all duration-200 hover:shadow-xl">
      <div className="relative cursor-pointer" onClick={onClick}>
        <div className={cn("relative w-full overflow-hidden", aspectRatio)}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setLiked(!liked);
                toast.success(liked ? "Removed from likes" : "Added to likes");
              }}
              className="rounded-full bg-white p-1.5 shadow-md transition-transform hover:scale-110"
            >
              <Heart
                className={cn("h-4 w-4", liked && "fill-red-500 text-red-500")}
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.info("Saved to bookmarks");
              }}
              className="rounded-full bg-white p-1.5 shadow-md transition-transform hover:scale-110"
            >
              <Bookmark className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toast.info("Share option");
              }}
              className="rounded-full bg-white p-1.5 shadow-md transition-transform hover:scale-110"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <CardContent className="p-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold line-clamp-1">{item.title}</h3>
            <p className="text-xs text-muted-foreground">{item.author}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.info("More options");
            }}
            className="rounded-full p-1 transition-colors hover:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <Heart className="h-3 w-3 fill-red-500 text-red-500" />
          <span className="text-xs text-muted-foreground">{item.likes}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MasonryGridDemoPage() {
  const [items, setItems] = React.useState(sampleImages.slice(0, 9));
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  const handleLoadMore = () => {
    if (loadingMore) return;

    setLoadingMore(true);
    setTimeout(() => {
      const currentCount = items.length;
      if (currentCount < sampleImages.length) {
        setItems(sampleImages.slice(0, currentCount + 3));
      }
      if (currentCount + 3 >= sampleImages.length) {
        setHasMore(false);
      }
      setLoadingMore(false);
      toast.info("Loaded more pins");
    }, 1000);
  };

  const handleItemClick = (index: number, item: React.ReactNode) => {
    toast.info(`Clicked pin ${index + 1}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Masonry Grid Components</h1>
          <p className="text-muted-foreground mt-1">
            Pinterest-style masonry layout with responsive columns
          </p>
        </div>

        <Tabs defaultValue="pinterest">
          <TabsList className="mb-6">
            <TabsTrigger value="pinterest">Pinterest Style</TabsTrigger>
            <TabsTrigger value="responsive">Responsive Columns</TabsTrigger>
            <TabsTrigger value="infinite">Infinite Scroll</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
          </TabsList>

          {/* Pinterest Style */}
          <TabsContent value="pinterest">
            <DashboardCard title="Pinterest Style Masonry Grid">
              <MasonryGrid
                columnCount={{
                  default: 2,
                  sm: 2,
                  md: 3,
                  lg: 4,
                  xl: 5,
                }}
                gap={16}
                animated
                onItemClick={handleItemClick}
              >
                {sampleImages.map((item, index) => (
                  <PinCard key={item.id} item={item} index={index} />
                ))}
              </MasonryGrid>
            </DashboardCard>
          </TabsContent>

          {/* Responsive Columns */}
          <TabsContent value="responsive">
            <DashboardCard title="Responsive Columns">
              <div className="mb-4 text-sm text-muted-foreground">
                <p>Column counts change based on screen width:</p>
                <ul className="mt-1 list-inside list-disc">
                  <li>Mobile: 2 columns</li>
                  <li>Tablet: 3 columns</li>
                  <li>Desktop: 4 columns</li>
                  <li>Large Desktop: 5 columns</li>
                </ul>
              </div>
              <MasonryGrid
                columnCount={{
                  default: 2,
                  md: 3,
                  lg: 4,
                  xl: 5,
                }}
                gap={16}
                animated
              >
                {sampleImages.slice(0, 12).map((item, index) => (
                  <PinCard key={item.id} item={item} index={index} />
                ))}
              </MasonryGrid>
            </DashboardCard>
          </TabsContent>

          {/* Infinite Scroll */}
          <TabsContent value="infinite">
            <DashboardCard title="Infinite Scroll Masonry">
              <MasonryGrid
                columnCount={{
                  default: 2,
                  md: 3,
                  lg: 4,
                }}
                gap={16}
                animated
                loading={loadingMore}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                onItemClick={handleItemClick}
              >
                {items.map((item, index) => (
                  <PinCard key={item.id} item={item} index={index} />
                ))}
              </MasonryGrid>

              {!hasMore && items.length >= sampleImages.length && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  You've reached the end
                </div>
              )}
            </DashboardCard>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <div className="grid gap-6">
              <DashboardCard title="Loading State">
                <MasonryGrid columnCount={{ default: 3 }} loading>
                  {[]}
                </MasonryGrid>
              </DashboardCard>

              <DashboardCard title="Empty State">
                <MasonryGrid
                  columnCount={{ default: 3 }}
                  empty
                  emptyMessage="No pins found in this board"
                >
                  {[]}
                </MasonryGrid>
              </DashboardCard>

              <DashboardCard title="Custom Gap (8px)">
                <MasonryGrid columnCount={{ default: 3 }} gap={8} animated>
                  {sampleImages.slice(0, 9).map((item, index) => (
                    <PinCard key={item.id} item={item} index={index} />
                  ))}
                </MasonryGrid>
              </DashboardCard>

              <DashboardCard title="Without Animation">
                <MasonryGrid
                  columnCount={{ default: 3 }}
                  gap={16}
                  animated={false}
                >
                  {sampleImages.slice(0, 9).map((item, index) => (
                    <PinCard key={item.id} item={item} index={index} />
                  ))}
                </MasonryGrid>
              </DashboardCard>

              <DashboardCard title="Different Gaps per Breakpoint">
                <MasonryGrid
                  columnCount={{ default: 2, md: 3, lg: 4 }}
                  gap={16}
                  breakpointGap={{
                    sm: 8,
                    md: 12,
                    lg: 16,
                    xl: 20,
                  }}
                  animated
                >
                  {sampleImages.slice(0, 12).map((item, index) => (
                    <PinCard key={item.id} item={item} index={index} />
                  ))}
                </MasonryGrid>
              </DashboardCard>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Import cn utility
import { cn } from "@/lib/utils";
