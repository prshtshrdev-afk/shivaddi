import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getContactInfo, getSiteSettings } from "@/lib/site";
import HeroSlider from "@/components/home/hero-slider";
import CategoryRail, {
  type CategoryTile,
} from "@/components/home/category-rail";
import PromoBand from "@/components/home/promo-band";
import FeaturedProducts from "@/components/home/featured-products";
import ExploreMatters, {
  type ExploreProduct,
} from "@/components/home/explore-matters";
import TileVisualizer, {
  type VisualizerProduct,
} from "@/components/home/tile-visualizer";
import StatStrip, { type BrandStat } from "@/components/home/stat-strip";
import LargeSlabs, { type SlabProduct } from "@/components/home/large-slabs";
import AccessoriesBand, {
  type AccessoryChip,
} from "@/components/home/accessories-band";
import BrandStatement from "@/components/home/brand-statement";
import WhyUs from "@/components/home/why-us";
import DesignIdeasTabs from "@/components/home/design-ideas-tabs";
import ClientsMarquee from "@/components/home/clients-marquee";
import Testimonials from "@/components/home/testimonials";
import GalleryStrip from "@/components/home/gallery-strip";
import BlogStrip from "@/components/home/blog-strip";
import type { ProductCardData } from "@/components/products/product-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Premium Tiles, Marble, Granite & Sanitaryware in Madhubani | Shiv Aadi",
  description:
    "Premium tiles, marble, granite and sanitaryware in Madhubani, Bihar. B2B wholesale pricing for builders, architects and dealers. Visit our showroom or request a quote.",
};

function productThumb(
  p: { images: { url: string; isThumbnail: boolean }[] },
): string | null {
  const sorted = [...p.images].sort(
    (a, b) => Number(b.isThumbnail) - Number(a.isThumbnail),
  );
  return sorted[0]?.url ?? null;
}

async function getHeroSlides() {
  const s = await getSiteSettings();
  const hero1 = s["hero1Image"] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1920&auto=format&fit=crop";
  const hero2 = s["hero2Image"] || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1920&auto=format&fit=crop";
  const hero3 = s["hero3Image"] || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1920&auto=format&fit=crop";
  const contact = await getContactInfo(s);
  const clean = contact.whatsapp.replace(/[^0-9]/g, "");
  const waLink = clean
    ? `https://wa.me/${clean}?text=${encodeURIComponent("Hello Shiv Aadi! I'd like to enquire about tiles & marble.")}`
    : "";

  return {
    slides: [
      {
        image: hero1,
        kicker: s["heroKicker"] || "Premium Tiles · Marble · Sanitaryware · Granite",
        title: s["heroTitle"] || "Crafting India's Finest Spaces, One Surface at a Time",
        description:
          s["heroDescription"] ||
          "From marble showrooms to large-format tiles, Shiv Aadi brings premium surfaces and honest B2B pricing to builders and homeowners.",
        primaryCta: { label: "Explore Products", href: "/products" },
        secondaryCta: { label: "Get B2B Quote", href: "/b2b-quote" },
      },
      {
        image: hero2,
        kicker: "Large Format · Luxury Finish",
        title: "800×1600 Large Format Slabs, Engineered for Grand Spaces",
        description:
          "Fewer joints, grander rooms. Discover vitrified slabs that read as a single, continuous surface of stone.",
        primaryCta: { label: "View Collections", href: "/categories/large-tiles" },
        secondaryCta: { label: "Talk to an Expert", href: waLink || "/contact" },
      },
      {
        image: hero3,
        kicker: "Hotels · Offices · Retail",
        title: "Premium Surfaces for Commercial Projects",
        description:
          "From hotel lobbies to corporate towers — we supply and support large-scale commercial installations across Bihar & Jharkhand.",
        primaryCta: { label: "Our Projects", href: "/projects" },
        secondaryCta: { label: "Request Sample", href: "/b2b-quote" },
      },
    ],
  };
}

export default async function HomePage() {
  const { slides } = await getHeroSlides();
  const s = await getSiteSettings();
  const contact = await getContactInfo(s);

  const waLink = contact.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hello Shiv Aadi! I'd like to see this tile in my space.")}`
    : "";

  const [
    categories,
    featured,
    exploreRows,
    about,
    whyUsItemsRaw,
    statsRaw,
    testimonials,
    gallery,
    posts,
    projects,
    slabs,
    accessoryProducts,
  ] = await Promise.all([
    prisma.category.findMany({
      where: { published: true, parentId: null },
      orderBy: { displayOrder: "asc" },
      include: { children: { where: { published: true }, orderBy: { displayOrder: "asc" } } },
    }),
    prisma.product.findMany({
      where: { published: true, featured: true },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    }),
    prisma.product.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 36,
      include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    }),
    prisma.pageContent.findMany({
      where: { page: "home", section: "about" },
      select: { key: true, content: true },
    }),
    prisma.pageContent.findMany({
      where: { page: "home", section: "why-us" },
      select: { key: true, content: true },
      orderBy: { key: "asc" },
    }),
    prisma.pageContent.findMany({
      where: { page: "home", section: "stats" },
      select: { key: true, content: true },
      orderBy: { key: "asc" },
    }),
    prisma.testimonial.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 6,
    }),
    prisma.galleryImage.findMany({
      where: { published: true },
      orderBy: { sortOrder: "asc" },
      take: 12,
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 12,
      select: { name: true },
    }),
    prisma.product.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    }),
    prisma.product.findMany({
      where: {
        published: true,
        categoryLinks: {
          some: {
            category: { slug: { in: ["accent-tiles", "3d-tiles", "flexi-tiles"] } },
          },
        },
      } as unknown as import("@/app/generated/prisma/client").Prisma.ProductWhereInput,
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
    }),
  ]);

  const aboutContent = Object.fromEntries(about.map((r) => [r.key, r.content]));

  const featuredProducts: ProductCardData[] = featured.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price?.toString() ?? null,
    priceType: p.priceType,
    size: p.size,
    finish: p.finish,
    isNew: p.isNew,
    featured: p.featured,
    category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
    images: p.images.map((img) => ({
      url: img.url,
      alt: img.alt,
      isThumbnail: img.isThumbnail,
    })),
  }));

  const exploreProducts: ExploreProduct[] = exploreRows.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    material: p.material,
    finish: p.finish,
    colour: p.colour,
    size: p.size,
    image: productThumb(p),
    categoryName: p.category?.name ?? null,
    categorySlug: p.category?.slug ?? null,
  }));

  const visualizerProducts: VisualizerProduct[] = exploreRows.slice(0, 24).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image: productThumb(p),
  }));

  const largeFormat = slabs.filter((p) =>
    /1200|1600|2400|slab/i.test(p.size ?? ""),
  );
  
  // Use products with images as fallback for large slabs section
  const productsWithImages = slabs.filter((p) => productThumb(p));
  const slabRows = largeFormat.length >= 3 ? largeFormat : productsWithImages.length >= 3 ? productsWithImages : slabs;

  const slabProducts: SlabProduct[] = slabRows.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    size: p.size,
    finish: p.finish,
    image: productThumb(p),
    categoryName: p.category?.name ?? null,
    categorySlug: p.category?.slug ?? null,
  }));

  const accessoryChips: AccessoryChip[] = accessoryProducts.map((p) => ({
    label: p.name ?? "",
    sub: p.size ?? "",
  }));

  const whyUsItems = whyUsItemsRaw
    .map((r) => {
      try {
        return JSON.parse(r.content) as { icon: string; title: string; text: string };
      } catch {
        return null;
      }
    })
    .filter((x): x is { icon: string; title: string; text: string } => x !== null);

  const stats: BrandStat[] = statsRaw
    .map((r) => {
      try {
        return JSON.parse(r.content) as { value: string; label: string };
      } catch {
        return null;
      }
    })
    .filter((x): x is { value: string; label: string } => x !== null)
    .slice(0, 4);

  const heroCategory = categories[0];
  const tilesCat = categories.find((c) => c.slug === "tiles");
  const railTiles: CategoryTile[] = [];
  if (tilesCat?.children?.length) {
    railTiles.push(
      ...tilesCat.children.map((ch) => ({
        name: ch.name,
        slug: ch.slug,
        image: ch.image ?? null,
      })),
    );
  }
  for (const c of categories) {
    if (c.slug === "tiles") continue;
    railTiles.push({ name: c.name, slug: c.slug, image: c.image ?? null });
  }
  // Limit to 8 collections for Shop by Category
  railTiles.splice(8);
  const promoHref = heroCategory ? `/categories/${heroCategory.slug}` : "/products";
  const fallbackProductImage = exploreRows.flatMap((p) => {
    const thumb = productThumb(p);
    return thumb ? [thumb] : [];
  })[0] ?? "";
  const promoImage =
    s["promoImage"] ||
    fallbackProductImage;

  return (
    <>
      <HeroSlider slides={slides} />
      <CategoryRail tiles={railTiles} productFallbacks={exploreRows.flatMap((p) => { const t = productThumb(p); return t ? [t] : []; }).slice(0, 8)} />
      <LargeSlabs products={slabProducts} />
      <StatStrip
        stats={stats}
        heading="A Decade of Delivering Premium Surfaces"
        description="From our Madhubani showroom to projects across Bihar & Jharkhand — premium materials, honest pricing and dependable supply, every single time."
      />
      <PromoBand
        image={promoImage}
        title={
          s["promoTitle"] ||
          "New Slabs, Fresh Finishes Just Surfaced"
        }
        description={
          s["promoDescription"] ||
          "The latest large-format grades, marble looks and designer finishes have landed in our showroom — explore the range before it sells out."
        }
        href={promoHref}
        ctaLabel="Explore Range"
      />
      <FeaturedProducts products={featuredProducts} />
      <ExploreMatters products={exploreProducts} fallbackImage={fallbackProductImage} />
      <TileVisualizer products={visualizerProducts} whatsappLink={waLink} roomImages={gallery.slice(0, 5).map(g => g.url)} />
      <BrandStatement
        image={s["aboutImage"] || fallbackProductImage}
        heading={aboutContent["heading"] || s["aboutHeading"] || "The Shiv Aadi Story"}
        badge={aboutContent["kicker"] || "Rooted in Mithila"}
        description={
          aboutContent["description"] ||
          s["aboutDescription"] ||
          "From marble showrooms to large-format tiles, Shiv Aadi brings premium surfaces and honest B2B pricing to builders, architects and homeowners across the region."
        }
        stats={stats}
      />
      <WhyUs items={whyUsItems} />
      <DesignIdeasTabs
        images={gallery.map((g) => ({
          id: g.id,
          url: g.url,
          title: g.title,
          category: g.category,
        }))}
      />
      <ClientsMarquee names={projects.map((p) => p.name)} />
      <Testimonials items={testimonials} />
      <GalleryStrip images={gallery} />
      <AccessoriesBand
        title="Finish the Space With Designer Accents"
        description="Decorative, textured and specialty tiles that complete the look — sourced, verified and stocked under one roof."
        chips={accessoryChips}
        ctaHref="/categories/accent-tiles"
        ctaLabel="Explore Accents"
        image={accessoryProducts[0] ? productThumb(accessoryProducts[0]) : null}
      />
      <BlogStrip posts={posts} />
    </>
  );
}

export const runtime = "nodejs";