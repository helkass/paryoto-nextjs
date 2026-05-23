// components/datagrid/product-card.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart, Heart } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    status: "active" | "inactive" | "draft";
    image?: string;
    rating?: number;
  };
  variant?: "default" | "compact" | "horizontal";
  onView?: (product: ProductCardProps["product"]) => void;
  onAddToCart?: (product: ProductCardProps["product"]) => void;
  onWishlist?: (product: ProductCardProps["product"]) => void;
  className?: string;
}

export function ProductCard({
  product,
  variant = "default",
  onView,
  onAddToCart,
  onWishlist,
  className,
}: ProductCardProps) {
  const statusConfig = {
    active: {
      label: "Active",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    },
    inactive: {
      label: "Inactive",
      className:
        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
    },
    draft: {
      label: "Draft",
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    },
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (variant === "horizontal") {
    return (
      <Card
        className={cn(
          "flex gap-4 p-4 hover:shadow-lg transition-shadow",
          className
        )}
      >
        <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">
              📦
            </div>
          )}
        </div>
        <div className="flex-1 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              <Badge className={statusConfig[product.status].className}>
                {statusConfig[product.status].label}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView?.(product)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" onClick={() => onAddToCart?.(product)}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <Card className={cn("p-3 hover:shadow-lg transition-shadow", className)}>
        <div className="flex gap-3">
          <div className="relative w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
            {product.image ? (
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl">
                📦
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{product.name}</h3>
            <p className="text-xs text-muted-foreground">{product.category}</p>
            <p className="text-sm font-bold text-primary mt-1">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  // Default variant
  return (
    <Card
      className={cn(
        "group overflow-hidden hover:shadow-lg transition-all duration-300",
        className
      )}
    >
      <div className="relative aspect-square bg-muted">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            📦
          </div>
        )}

        {/* Badge */}
        <Badge
          className={cn(
            "absolute top-2 right-2",
            statusConfig[product.status].className
          )}
        >
          {statusConfig[product.status].label}
        </Badge>

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onView?.(product)}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button size="sm" onClick={() => onAddToCart?.(product)}>
            <ShoppingCart className="h-4 w-4 mr-1" />
            Cart
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onWishlist?.(product)}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-muted-foreground">
            Stock: {product.stock}
          </span>
        </div>
        {product.rating && (
          <div className="mt-2 flex items-center gap-1">
            <span className="text-sm text-yellow-500">★</span>
            <span className="text-sm">{product.rating}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
