import type { Metadata } from "next";
import { Search, SearchX } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard, {
  type ProductCardData,
} from "@/components/products/product-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Products | Shiv Aadi",
  description:
    "Search the Shiv Aadi catalogue - tiles, marble, granite and sanitaryware in Darbhanga.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").trim();

  let products: ProductCardData[] = [];

  if (q) {
    const rows = await prisma.product.findMany({
      where: {
        published: true,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { material: { contains: q, mode: "insensitive" } },
          { finish: { contains: q, mode: "insensitive" } },
          { colour: { contains: q, mode: "insensitive" } },
          { subcategory: { contains: q, mode: "insensitive" } },
          { tags: { has: q } },
          { category: { is: { name: { contains: q, mode: "insensitive" } } } },
        ],
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 24,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
    });

    products = rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: p.price?.toString() ?? null,
      priceType: p.priceType,
      size: p.size,
      finish: p.finish,
      isNew: p.isNew,
      featured: p.featured,
      category: p.category
        ? { name: p.category.name, slug: p.category.slug }
        : null,
      images: p.images.map((img) => ({
        url: img.url,
        alt: img.alt,
        isThumbnail: img.isThumbnail,
      })),
    }));
  }

  return (
    <section className="section-beige py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="display font-bold text-charcoal">Search the Catalogue</h1>

        <form action="/search" className="mt-8 flex max-w-2xl gap-3">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone" />
            <input
              name="q"
              defaultValue={q}
              autoFocus
              placeholder="Try marble, vitrified, 800x1600, glossy..."
              className="h-14 w-full rounded-[2px] border border-charcoal/15 bg-white pl-11 pr-4 text-sm text-charcoal placeholder:text-stone/70 transition-colors focus:border-gold focus:outline-none"
            />
          </label>
          <button type="submit" className="btn-gold shrink-0">
            Search
          </button>
        </form>

        <div className="mt-14">
          {!q ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Search className="h-10 w-10 text-stone/50" />
              <p className="mt-4 font-serif text-2xl font-semibold text-charcoal">
                What are you looking for?
              </p>
              <p className="mt-2 max-w-md text-sm text-stone">
                You can search by product name, material, finish, colour, size
                or category name.
              </p>
            </div>
          ) : (
            <>
              {products.length > 0 ? (
                <p className="mb-6 text-[12px] uppercase tracking-[0.16em] text-stone">
                  {products.length} {products.length === 1 ? "match" : "matches"} for{" "}
                  <span className="font-bold text-charcoal">&quot;{q}&quot;</span>
                </p>
              ) : (
                <div className="flex flex-col items-center border border-dashed border-charcoal/20 bg-white py-20 text-center">
                  <SearchX className="h-10 w-10 text-stone/50" />
                  <p className="mt-4 font-serif text-2xl font-semibold text-charcoal">
                    No results for &quot;{q}&quot;
                  </p>
                  <p className="mt-2 max-w-md text-sm text-stone">
                    Check the spelling, or contact us and we will source the
                    right surface for your project.
                  </p>
                </div>
              )}
              {products.length > 0 && (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export const runtime = "nodejs";