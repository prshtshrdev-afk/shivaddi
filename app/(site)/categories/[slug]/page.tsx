import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Layers, ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/product-card";
import { toProductCardData } from "@/components/products/serialize";

export const dynamic = "force-dynamic";

const PER_PAGE = 24;

export async function generateMetadata(
  { params }: PageProps<"/categories/[slug]">,
): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description:
      category.description ??
      `${category.name} – premium tiles, marble, granite and sanitaryware from Shiv Aadi.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: PageProps<"/categories/[slug]">) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(
    1,
    parseInt(Array.isArray(sp.page) ? sp.page[0] : sp.page ?? "1", 10) || 1,
  );

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        where: { published: true },
        orderBy: { displayOrder: "asc" },
      },
      parent: true,
    },
  });
  if (!category || !category.published) notFound();

  const childIds = category.children.map((c) => c.id);
  const where = {
    published: true,
    OR: [
      { categoryId: { in: [category.id, ...childIds] } },
      { categoryLinks: { some: { categoryId: { in: [category.id, ...childIds] } } } },
    ],
  };

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: { select: { name: true, slug: true } },
      },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const shown = Math.min(page, totalPages);

  return (
    <div className="bg-beige pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 text-[11px] uppercase tracking-[0.16em] text-stone">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition-colors hover:text-gold-dark">Home</Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li>
              <Link href="/products" className="transition-colors hover:text-gold-dark">Products</Link>
            </li>
            {category.parent && (
              <>
                <li><ChevronRight className="h-3 w-3" /></li>
                <li>
                  <Link href={`/categories/${category.parent.slug}`} className="transition-colors hover:text-gold-dark">
                    {category.parent.name}
                  </Link>
                </li>
              </>
            )}
            <li><ChevronRight className="h-3 w-3" /></li>
            <li className="text-charcoal">{category.name}</li>
          </ol>
        </nav>

        {/* Category hero */}
        <div className="relative mb-12 overflow-hidden border border-charcoal/10 bg-charcoal">
          {category.image && (
            <Image
              src={category.image}
              alt={category.name}
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-45"
            />
          )}
          <div className="relative py-20 px-6 sm:px-10">
            <p className="section-kicker mb-3">
              {category.parent?.name ?? "Shiv Aadi Collection"}
            </p>
            <h1 className="display font-bold text-white">{category.name}</h1>
            {category.description && (
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/70">
                {category.description}
              </p>
            )}
            <p className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <Layers className="h-4 w-4" />
              {total} product{total === 1 ? "" : "s"} available
            </p>
          </div>
        </div>

        {/* Subcategory chips */}
        {category.children.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/categories/${child.slug}`}
                className="border border-charcoal/15 bg-white px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-charcoal/75 transition-all duration-300 hover:border-gold hover:text-gold-dark"
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}

        {/* Products */}
        {total === 0 ? (
          <div className="border border-charcoal/10 bg-white px-8 py-20 text-center">
            <h2 className="font-serif text-2xl font-bold text-charcoal">
              No products in this category yet
            </h2>
            <p className="mt-3 text-sm text-stone">
              New arrivals are added regularly. Check back soon or contact us for availability.
            </p>
            <Link href="/contact" className="btn-gold mt-8">
              Ask About Availability
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={toProductCardData(p)} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
                {shown > 1 && (
                  <Link
                    href={`/categories/${category.slug}?page=${shown - 1}`}
                    className="inline-flex items-center gap-1 border border-charcoal/15 bg-white px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal transition-colors hover:border-gold hover:text-gold-dark"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((n) => n === 1 || n === totalPages || Math.abs(n - shown) <= 2)
                  .reduce<number[]>((acc, n, i, arr) => {
                    if (i > 0 && n - arr[i - 1] > 1) acc.push(-1);
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) =>
                    n === -1 ? (
                      <span key={`gap-${i}`} className="px-2 text-stone">
                        …
                      </span>
                    ) : (
                      <Link
                        key={n}
                        href={`/categories/${category.slug}?page=${n}`}
                        aria-current={n === shown ? "page" : undefined}
                        className={`px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                          n === shown
                            ? "bg-gold text-charcoal"
                            : "border border-charcoal/15 bg-white text-charcoal hover:border-gold hover:text-gold-dark"
                        }`}
                      >
                        {n}
                      </Link>
                    ),
                  )}
                {shown < totalPages && (
                  <Link
                    href={`/categories/${category.slug}?page=${shown + 1}`}
                    className="inline-flex items-center gap-1 border border-charcoal/15 bg-white px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal transition-colors hover:border-gold hover:text-gold-dark"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}