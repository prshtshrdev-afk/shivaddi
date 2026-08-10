import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  BadgeCheck,
  MessageCircle,
  ChevronRight,
  Ruler,
  Layers,
  Sparkles,
  Palette,
  Box,
  MoveHorizontal,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { getContactInfo } from "@/lib/site";
import ProductGallery from "@/components/products/product-gallery";
import ProductCard, { priceLabel } from "@/components/products/product-card";
import { toProductCardData } from "@/components/products/serialize";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { params }: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, shortDescription: true, seoTitle: true, seoDescription: true },
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.seoTitle ?? product.name,
    description:
      product.seoDescription ??
      product.shortDescription ??
      `${product.name} – premium tiles, marble, granite and sanitaryware from Shiv Aadi.`,
  };
}

const SPEC_LABELS: { key: string; label: string; icon: typeof Ruler }[] = [
  { key: "size", label: "Size", icon: Ruler },
  { key: "thickness", label: "Thickness", icon: Layers },
  { key: "finish", label: "Finish", icon: Sparkles },
  { key: "colour", label: "Colour", icon: Palette },
  { key: "material", label: "Material", icon: Box },
  { key: "application", label: "Best For", icon: MoveHorizontal },
];

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const { whatsapp } = await getContactInfo();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { name: true, slug: true, parent: { select: { slug: true } } } },
    },
  });
  if (!product || !product.published) notFound();

  const related = await prisma.product.findMany({
    where: {
      published: true,
      id: { not: product.id },
      OR: [
        ...(product.categoryId ? [{ categoryId: product.categoryId }] : []),
        ...(product.tags.length
          ? [{ tags: { hasSome: product.tags.slice(0, 3) } }]
          : []),
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { name: true, slug: true } },
    },
  });

  const waNumber = whatsapp.replace(/[^0-9]/g, "");
  const waLink = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Hello Shiv Aadi! I'd like to enquire about ${product.name}.`,
      )}`
    : "";

  const price = formatPrice(product.price?.toString());

  return (
    <div className="bg-beige pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8 text-[11px] uppercase tracking-[0.16em] text-stone">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition-colors hover:text-gold-dark">Home</Link>
            </li>
            <li><ChevronRight className="h-3 w-3" /></li>
            <li>
              <Link href="/products" className="transition-colors hover:text-gold-dark">Products</Link>
            </li>
            {product.category && (
              <>
                <li><ChevronRight className="h-3 w-3" /></li>
                <li>
                  <Link
                    href={`/categories/${product.category.slug}`}
                    className="transition-colors hover:text-gold-dark"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li><ChevronRight className="h-3 w-3" /></li>
            <li className="text-charcoal">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <ProductGallery
            images={product.images.map((i) => ({
              url: i.url,
              alt: i.alt,
              isThumbnail: i.isThumbnail,
            }))}
            name={product.name}
          />

          {/* Info */}
          <div>
            <p className="section-kicker mb-3">
              {product.category?.name ?? "Shiv Aadi"}
              {product.stockStatus ? ` · ${product.stockStatus}` : ""}
            </p>
            <h1 className="display font-bold text-charcoal">{product.name}</h1>

            {product.shortDescription && (
              <p className="mt-5 text-[15px] leading-relaxed text-stone">
                {product.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="mt-8 border-y border-charcoal/10 py-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-stone">
                {product.priceType === "FROM"
                  ? "Starting From"
                  : product.priceType === "EXACT"
                    ? "Price"
                    : "Price"}
              </p>
              <p className="mt-1 font-serif text-4xl font-bold text-charcoal">
                {priceLabel({ price: price, priceType: product.priceType }) || "Price on Request"}
              </p>
              {product.moq && (
                <p className="mt-2 text-[12px] uppercase tracking-[0.14em] text-stone">
                  MOQ: {product.moq}
                </p>
              )}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/b2b-quote?product=${product.slug}`}
                className="btn-gold flex-1"
              >
                Request B2B Quote
              </Link>
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline-dark flex-1"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp Enquiry
                </a>
              )}
            </div>

            {/* Assurance */}
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: BadgeCheck, text: "Premium Grade" },
                { icon: ShieldCheck, text: "Batch Verified" },
                { icon: Truck, text: "Bulk Dispatch" },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-2.5 border border-charcoal/10 bg-white px-4 py-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-charcoal/80"
                >
                  <Icon className="h-4 w-4 shrink-0 text-gold-dark" />
                  {text}
                </li>
              ))}
            </ul>

            {/* Specs */}
            <div className="mt-10">
              <h2 className="font-serif text-lg font-semibold text-charcoal">Product Specifications</h2>
              <dl className="mt-5 grid grid-cols-1 gap-px border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2">
                {SPEC_LABELS.map(({ key, label, icon: Icon }) => {
                  const value = product[key as keyof typeof product];
                  if (!value) return null;
                  return (
                    <div key={key} className="flex items-center gap-3 bg-white px-5 py-4">
                      <Icon className="h-4 w-4 shrink-0 text-gold-dark" />
                      <div>
                        <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone">
                          {label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium text-charcoal">
                          {String(value)}
                        </dd>
                      </div>
                    </div>
                  );
                })}
              </dl>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mt-10">
                <h2 className="font-serif text-lg font-semibold text-charcoal">About This Product</h2>
                <p className="mt-4 whitespace-pre-line text-[15px] leading-relaxed text-stone">
                  {product.description}
                </p>
              </div>
            )}

            {product.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/products?q=${encodeURIComponent(tag)}`}
                    className="border border-charcoal/15 bg-white px-3 py-1.5 text-[11px] uppercase tracking-[0.12em] text-stone transition-colors hover:border-gold hover:text-gold-dark"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="section-kicker mb-2">You May Also Like</p>
                <h2 className="display font-bold text-charcoal">Related Products</h2>
              </div>
              <Link href="/products" className="btn-outline-dark">
                View All Products
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={toProductCardData(p as never)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}