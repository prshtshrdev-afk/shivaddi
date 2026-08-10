import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/products/product-card";
import { toProductCardData } from "@/components/products/serialize";

export const dynamic = "force-dynamic";

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
}: PageProps<"/categories/[slug]">) {
  const { slug } = await params;

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

  const products = await prisma.product.findMany({
    where: {
      published: true,
      categoryId: {
        in: [category.id, ...category.children.map((c) => c.id)],
      },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { name: true, slug: true } },
    },
  });

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
              {products.length} product{products.length === 1 ? "" : "s"} available
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
        {products.length === 0 ? (
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={toProductCardData(p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}