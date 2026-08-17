"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import type { Category } from "@/app/generated/prisma/client";
import { cn } from "@/lib/utils";
import ProductCard, { type ProductCardData } from "./product-card";

function paginationPages(page: number, total: number, perPage: number) {
  const last = Math.max(1, Math.ceil(total / perPage));
  const shown = Math.min(page, last);
  const pages: number[] = [];
  for (let n = 1; n <= last; n++) {
    if (n === 1 || n === last || Math.abs(n - shown) <= 2) pages.push(n);
  }
  const out: number[] = [];
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) out.push(0);
    out.push(pages[i]);
  }
  return out;
}

const PRICE_TYPES = [
  { value: "EXACT", label: "Exact Price" },
  { value: "FROM", label: "Starting From" },
  { value: "ON_REQUEST", label: "Price on Request" },
];

const SORTS = [
  { value: "newest", label: "Newest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function ProductGrid({
  products,
  categories,
  activeCategory,
  search,
  priceType,
  sort,
  total,
  page = 1,
  perPage = 24,
}: {
  products: ProductCardData[];
  categories: (Category & { children?: Category[] })[];
  activeCategory?: string;
  search?: string;
  priceType?: string;
  sort?: string;
  total?: number;
  page?: number;
  perPage?: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(search ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function apply(patch: Record<string, string | undefined>) {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    next.delete("page");
    startTransition(() => router.push(`/products?${next.toString()}`));
  }

  function pagedParams(n: number) {
    const next = new URLSearchParams(params);
    next.set("page", String(n));
    return next.toString();
  }

  return (
    <div className="bg-beige py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Page header */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="section-kicker mb-2">Shop the Range</p>
            <h1 className="display font-bold text-charcoal">
              {activeCategory
                ? categories.find((c) => c.slug === activeCategory)?.name ??
                  "Products"
                : "All Products"}
            </h1>
            <p className="mt-2 text-sm text-stone">
              {products.length} product{products.length === 1 ? "" : "s"}
              {search ? ` matching “${search}”` : ""}
            </p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3">
            <label htmlFor="sort" className="sr-only">
              Sort products
            </label>
            <div className="relative">
              <select
                id="sort"
                value={sort ?? "newest"}
                onChange={(e) => apply({ sort: e.target.value === "newest" ? undefined : e.target.value })}
                className="appearance-none border border-charcoal/20 bg-white py-2.5 pl-4 pr-10 text-[12px] font-semibold uppercase tracking-[0.12em] text-charcoal focus:border-gold focus:outline-none"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
            </div>
          </div>
        </div>

        {/* Search + filter toggle */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              apply({ q: q.trim() || undefined });
            }}
            className="relative flex-1"
          >
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, material or tag…"
              className="w-full border border-charcoal/20 bg-white py-3 pl-11 pr-16 text-sm text-charcoal placeholder:text-stone/70 focus:border-gold focus:outline-none"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  apply({ q: undefined });
                }}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone transition-colors hover:text-charcoal"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
          <button
            type="button"
            onClick={() => setFiltersOpen((v) => !v)}
            className="inline-flex items-center justify-center gap-2 border border-charcoal/20 bg-white px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal transition-colors hover:border-gold hover:text-gold-dark"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {priceType && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
          </button>
        </div>

        {/* Filters */}
        {filtersOpen && (
          <div className="mb-10 grid gap-8 border border-charcoal/10 bg-white p-6 md:grid-cols-2">
            <div>
              <h2 className="mb-4 font-serif text-sm font-semibold uppercase tracking-[0.16em] text-charcoal">
                Price Type
              </h2>
              <div className="flex flex-wrap gap-2">
                {PRICE_TYPES.map((pt) => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => apply({ priceType: pt.value === priceType ? undefined : pt.value })}
                    className={cn(
                      "border px-4 py-2 text-[12px] font-medium uppercase tracking-[0.1em] transition-all duration-300",
                      pt.value === priceType
                        ? "border-gold bg-gold text-charcoal"
                        : "border-charcoal/20 bg-white text-charcoal/70 hover:border-gold/60 hover:text-charcoal",
                    )}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="mb-4 font-serif text-sm font-semibold uppercase tracking-[0.16em] text-charcoal">
                Categories
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => apply({ category: undefined })}
                  className={cn(
                    "border px-4 py-2 text-[12px] font-medium uppercase tracking-[0.1em] transition-all duration-300",
                    !activeCategory
                      ? "border-gold bg-gold text-charcoal"
                      : "border-charcoal/20 bg-white text-charcoal/70 hover:border-gold/60 hover:text-charcoal",
                  )}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => apply({ category: cat.slug === activeCategory ? undefined : cat.slug })}
                    className={cn(
                      "border px-4 py-2 text-[12px] font-medium uppercase tracking-[0.1em] transition-all duration-300",
                      cat.slug === activeCategory
                        ? "border-gold bg-gold text-charcoal"
                        : "border-charcoal/20 bg-white text-charcoal/70 hover:border-gold/60 hover:text-charcoal",
                    )}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Grid / empty state */}
        {isPending && (
          <p className="mb-6 text-[12px] uppercase tracking-[0.16em] text-stone">
            Updating results…
          </p>
        )}

        {products.length === 0 ? (
          <div className="border border-charcoal/10 bg-white px-8 py-20 text-center">
            <h2 className="font-serif text-2xl font-bold text-charcoal">
              No products found
            </h2>
            <p className="mt-3 text-sm text-stone">
              Try a different search or clear the filters.
            </p>
            <Link href="/products" className="btn-gold mt-8">
              Clear All Filters
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {total && total > perPage ? (
              <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
                {page > 1 && (
                  <Link
                    href={`?${pagedParams(page - 1)}`}
                    className="inline-flex items-center gap-1 border border-charcoal/15 bg-white px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal transition-colors hover:border-gold hover:text-gold-dark"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </Link>
                )}
                {paginationPages(page, total, perPage).map((n, i) =>
                  n === 0 ? (
                    <span key={`gap-${i}`} className="px-2 text-stone">
                      …
                    </span>
                  ) : (
                    <Link
                      key={n}
                      href={`?${pagedParams(n)}`}
                      aria-current={n === page ? "page" : undefined}
                      className={`px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                        n === page
                          ? "bg-gold text-charcoal"
                          : "border border-charcoal/15 bg-white text-charcoal hover:border-gold hover:text-gold-dark"
                      }`}
                    >
                      {n}
                    </Link>
                  ),
                )}
                {page < Math.ceil(total / perPage) && (
                  <Link
                    href={`?${pagedParams(page + 1)}`}
                    className="inline-flex items-center gap-1 border border-charcoal/15 bg-white px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal transition-colors hover:border-gold hover:text-gold-dark"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </nav>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}