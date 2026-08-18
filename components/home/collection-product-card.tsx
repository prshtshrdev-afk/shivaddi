"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CollectionProductCardProps = {
  name: string;
  slug: string;
  image: string;
  productCount: number;
  featuredProduct?: {
    name: string;
    price?: string | null;
    priceType?: "EXACT" | "FROM" | "ON_REQUEST";
    image: string;
  } | null;
};

export default function CollectionProductCard({
  name,
  slug,
  image,
  productCount,
  featuredProduct,
}: CollectionProductCardProps) {
  return (
    <Link
      href={`/categories/${slug}`}
      className="group relative block aspect-[4/5] overflow-hidden border border-charcoal/10 bg-charcoal"
    >
      <Image
        src={image}
        alt={name}
        fill
        sizes="(max-width:640px) 50vw, 25vw"
        className="object-cover opacity-90 transition-all duration-700 group-hover:scale-105 group-hover:opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/15 to-transparent" />
      
      {featuredProduct && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-white/95 backdrop-blur rounded-full px-3 py-1 text-xs font-medium text-charcoal">
            {featuredProduct.name}
          </div>
        </div>
      )}

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="font-serif text-lg font-bold text-white">
            {name}
          </p>
          {productCount > 0 && (
            <span className="bg-gold/90 text-charcoal text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded">
              {productCount} products
            </span>
          )}
        </div>
        
        {featuredProduct && (
          <div className="flex items-center gap-2 mb-3 text-white/80 text-sm">
            <span className="font-medium">
              {featuredProduct.priceType === "ON_REQUEST" 
                ? "Price on request"
                : featuredProduct.price 
                  ? `From ₹${featuredProduct.price}`
                  : "View collection"}
            </span>
          </div>
        )}

        <span className="mt-3 inline-flex h-8 w-8 items-center justify-center border border-gold/60 text-gold opacity-0 transition-all duration-500 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}