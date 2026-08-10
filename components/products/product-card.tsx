import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Product, ProductImage, Category } from "@/app/generated/prisma/client";
import { formatPrice } from "@/lib/utils";

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: string | null;
  priceType: Product["priceType"];
  size: string | null;
  finish: string | null;
  isNew: boolean;
  featured: boolean;
  category: Pick<Category, "name" | "slug"> | null;
  images: Pick<ProductImage, "url" | "alt" | "isThumbnail">[];
};

export function priceLabel(p: { price: string | null; priceType: Product["priceType"] }) {
  if (!p.price) return "Price on Request";
  const formatted = formatPrice(p.price);
  if (!formatted) return "Price on Request";
  if (p.priceType === "FROM") return `${formatted}+`;
  if (p.priceType === "ON_REQUEST") return "Price on Request";
  return formatted;
}

export default function ProductCard({
  product,
}: {
  product: ProductCardData;
}) {
  const image = [...product.images].sort((a, b) =>
    Number(b.isThumbnail) - Number(a.isThumbnail),
  )[0] ?? { url: "/file.svg", alt: product.name };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden border border-charcoal/10 bg-white transition-all duration-500 hover:border-gold/50 hover:shadow-card">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-beige"
      >
        <Image
          src={image.url}
          alt={image.alt ?? product.name}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-charcoal">
              New
            </span>
          )}
          {product.featured && (
            <span className="bg-charcoal px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold">
              Featured
            </span>
          )}
        </div>
        <div className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-charcoal/80 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold">
            View Details
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link
          href={`/products/${product.slug}`}
          className="font-serif text-[15px] font-semibold leading-snug text-charcoal transition-colors hover:text-gold-dark"
        >
          {product.name}
        </Link>
        <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-stone">
          {product.size ? `${product.size}${product.finish ? ` · ${product.finish}` : ""}` : product.category?.name ?? "Shiv Aadi"}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="text-[14px] font-semibold text-charcoal">
            {priceLabel(product)}
          </span>
          <Link
            href={`/b2b-quote?product=${product.slug}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-dark transition-colors hover:text-gold"
          >
            Get Quote
          </Link>
        </div>
      </div>
    </article>
  );
}