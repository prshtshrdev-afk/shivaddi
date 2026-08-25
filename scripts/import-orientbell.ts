/**
 * Orientbell → Shiv Aadi catalog importer (v3 – real category tree)
 *
 * Rebuilds the catalog to mirror the real Orientbell site:
 *   - 20 top-level collections + curated subcategories (Category tree)
 *   - Each product keeps ONE primary category (first path entry) for
 *     breadcrumbs/badges, PLUS many-to-many ProductCategory links built
 *     from the site's own category pages (overlapping membership, e.g.
 *     bathroom-tiles 3379, kitchen-tiles 4270, marble-tiles 1197 …)
 *   - No mock data: catalog is wiped and rebuilt
 *   - Featured spread across collections + isNew for newest arrivals
 *
 * Run: npx tsx scripts/import-orientbell.ts
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config(); // fall back to .env
import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const API_KEY = "5a4b9251b67027ff94d260e4ac6ac09e";
const SITE_KEY = "ss-unbxd-aapac-prod-orientbell53741713874410";
const BASE_URL = `https://search.unbxd.io/${API_KEY}/${SITE_KEY}/category`;

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

type RawProduct = {
  title?: string;
  sku?: string;
  uniqueId?: string;
  erpCode?: string;
  price?: number | string;
  List_Price?: number | string;
  metaTitle?: string;
  metaDescription?: string;
  designCodeDescription?: string;
  orientBody?: string;
  orientThickness?: string;
  tileSize?: string[];
  tilesFinish?: string[];
  colors?: string[];
  tileArea?: string[];
  tileType?: string[];
  tileDesign?: string[];
  tileCategory?: string;
  tileCollections?: string[];
  packingCodeDescription?: string;
  availabilityLabel?: string;
  availabilityText?: string;
  numberOfFaces?: string;
  slipResistent?: string;
  frostResistent?: string;
  imageUrl?: string[];
  Product_Image?: string;
  smallImage?: string;
  swatchImage?: string;
  thumbnail?: string;
  tilesImages?: string;
  unbxdCategoryPathId?: string[];
  categoryPath?: string[];
  createdAt?: string;
  newsFromDate?: string;
};

// ── Curated category tree (mirrors the real Orientbell site) ────────────────

type SubDef = { name: string; slug: string; aliases: string[] };

const TREE: { slug: string; name: string; subs: SubDef[] }[] = [
  {
    slug: "floor-tiles",
    name: "Floor Tiles",
    subs: [
      { name: "Vitrified Floor Tiles", slug: "vitrified-floor-tiles", aliases: ["vitrified floor tiles"] },
    ],
  },
  { slug: "wall-tiles", name: "Wall Tiles", subs: [] },
  {
    slug: "bathroom-tiles",
    name: "Bathroom Tiles",
    subs: [
      { name: "Floor", slug: "floor", aliases: ["floor", "bathroom floor tiles"] },
      { name: "Wall", slug: "wall", aliases: ["wall", "bathroom wall tiles"] },
      { name: "600x1200", slug: "600x1200", aliases: ["600x1200", "bathroom 600x1200"] },
      { name: "600x600", slug: "600x600", aliases: ["600x600", "bathroom 600x600"] },
      { name: "300x450", slug: "300x450", aliases: ["300x450", "bathroom 300x450"] },
      { name: "300x300", slug: "300x300", aliases: ["300x300", "bathroom 300x300 floor tiles"] },
    ],
  },
  {
    slug: "kitchen-tiles",
    name: "Kitchen Tiles",
    subs: [
      { name: "Floor", slug: "floor", aliases: ["floor", "kitchen floor tiles"] },
      { name: "Wall", slug: "wall", aliases: ["wall", "kitchen wall tiles"] },
      { name: "600x1200", slug: "600x1200", aliases: ["600x1200", "kitchen 600x1200"] },
      { name: "600x600", slug: "600x600", aliases: ["600x600", "kitchen 600x600"] },
      { name: "300x450", slug: "300x450", aliases: ["300x450", "kitchen 300x450"] },
      { name: "300x600", slug: "300x600", aliases: ["300x600", "kitchen 300x600"] },
      { name: "300x300", slug: "300x300", aliases: ["300x300", "kitchen 300x300 floor tiles"] },
    ],
  },
  {
    slug: "living-room-tiles",
    name: "Living Room Tiles",
    subs: [
      { name: "Floor", slug: "floor", aliases: ["floor", "living room floor tiles"] },
      { name: "Wall", slug: "wall", aliases: ["wall", "living room wall tiles"] },
      { name: "600x1200", slug: "600x1200", aliases: ["600x1200", "living room 600x1200"] },
      { name: "800x1600", slug: "800x1600", aliases: ["800x1600", "living room 800x1600"] },
      { name: "1200x1800", slug: "1200x1800", aliases: ["1200x1800", "living room 1200x1800"] },
    ],
  },
  {
    slug: "bedroom-tiles",
    name: "Bedroom Tiles",
    subs: [
      { name: "Floor", slug: "floor", aliases: ["floor", "bedroom floor tiles"] },
      { name: "Wall", slug: "wall", aliases: ["wall", "bedroom wall tiles"] },
    ],
  },
  {
    slug: "outdoor-tiles",
    name: "Outdoor Tiles",
    subs: [
      { name: "Floor", slug: "floor", aliases: ["floor", "outdoor floor tiles"] },
      { name: "Wall", slug: "wall", aliases: ["wall", "outdoor wall tiles"] },
    ],
  },
  { slug: "marble-tiles", name: "Marble Tiles", subs: [] },
  {
    slug: "vitrified-tiles",
    name: "Vitrified Tiles",
    subs: [
      { name: "GVT Tiles", slug: "gvt-tiles", aliases: ["gvt tiles", "gvt"] },
      { name: "PGVT Tiles", slug: "pgvt-tiles", aliases: ["pgvt tiles", "pgvt"] },
      { name: "DGVT Tiles", slug: "dgvt-tiles", aliases: ["dgvt tiles", "dgvt", "digital glazed vitrified tiles", "double glazed vitrified tiles"] },
      { name: "Full Body Vitrified Tiles", slug: "full-body-vitrified-tiles", aliases: ["full body vitrified tiles"] },
      { name: "Polished Vitrified Tiles", slug: "polished-vitrified-tiles", aliases: ["polished vitrified tiles"] },
    ],
  },
  { slug: "ceramic-tiles", name: "Ceramic Tiles", subs: [] },
  {
    slug: "wooden-tiles",
    name: "Wooden Tiles",
    subs: [
      { name: "Wooden Floor Tiles", slug: "wooden-floor-tiles", aliases: ["wooden floor tiles"] },
      { name: "Wooden Wall Tiles", slug: "wooden-wall-tiles", aliases: ["wooden wall tiles"] },
    ],
  },
  { slug: "large-tiles", name: "Large Tiles", subs: [] },
  {
    slug: "granite-tiles",
    name: "Granite Tiles",
    subs: [
      { name: "White Granite Tiles", slug: "white-granite-tiles", aliases: ["white granite tiles"] },
      { name: "Grey Granite Tiles", slug: "grey-granite-tiles", aliases: ["grey granite tiles", "gray granite tiles"] },
      { name: "Black Granite Tiles", slug: "black-granite-tiles", aliases: ["black granite tiles"] },
      { name: "Black Galaxy Granite Tiles", slug: "black-galaxy-granite-tiles", aliases: ["black galaxy granite tiles"] },
    ],
  },
  {
    slug: "flexi-tiles",
    name: "Flexi Tiles",
    subs: [
      { name: "Marble & Granite", slug: "marble-granite", aliases: ["marble granite tiles", "marble granite"] },
      { name: "Concrete Board", slug: "concrete-board", aliases: ["concrete board flexi", "concrete board"] },
      { name: "Earthen", slug: "earthen", aliases: ["earthen flexi tiles", "earthen"] },
      { name: "Fine Line", slug: "fine-line", aliases: ["fine line flexi", "fine line"] },
      { name: "Groove Cut Stone", slug: "groove-cut-stone", aliases: ["groove cut stone flexi", "groove cut stone"] },
      { name: "Rock Cut Stone", slug: "rock-cut-stone", aliases: ["rock cut stone flexi", "rock cut stone"] },
      { name: "Rough Stone", slug: "rough-stone", aliases: ["rough stone flexi", "rough stone"] },
      { name: "Stream Limestone", slug: "stream-limestone", aliases: ["stream limestone flexi", "stream limestone"] },
      { name: "Sunrise Arch", slug: "sunrise-arch", aliases: ["sunrise arch flexi tiles", "sunrise arch"] },
      { name: "Woven Jute", slug: "woven-jute", aliases: ["woven jute flexi", "woven jute"] },
    ],
  },
  {
    slug: "subway-tiles",
    name: "Subway Tiles",
    subs: [
      { name: "Sandy", slug: "sandy", aliases: ["sandy subway"] },
      { name: "Cloudy", slug: "cloudy", aliases: ["cloudy subway"] },
      { name: "Bamboo Flutes", slug: "bamboo-flutes", aliases: ["bamboo flutes subway", "bamboo flutes"] },
      { name: "Arch", slug: "arch", aliases: ["arch subway", "arch"] },
      { name: "Ridges", slug: "ridges", aliases: ["ridges subway", "ridges"] },
      { name: "Fresco", slug: "fresco", aliases: ["fresco subway", "fresco"] },
      { name: "Smoky", slug: "smoky", aliases: ["smoky subway", "smoky"] },
    ],
  },
  {
    slug: "elevation-tiles",
    name: "Elevation Tiles",
    subs: [
      { name: "300x450", slug: "300x450", aliases: ["300x450"] },
      { name: "300x600", slug: "300x600", aliases: ["300x600"] },
    ],
  },
  { slug: "texture-tiles", name: "Texture Tiles", subs: [] },
  { slug: "3d-tiles", name: "3D Tiles", subs: [] },
  { slug: "accent-tiles", name: "Accent Tiles", subs: [] },
  { slug: "anti-skid-tiles", name: "Anti Skid Tiles", subs: [] },
];

const TOP_BY_SLUG = new Map(TREE.map((t) => [t.slug, t]));

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

function num(v: number | string | undefined): number | null {
  if (v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseCategoryEntry(entry: string | undefined): string[] {
  if (!entry) return [];
  return entry
    .split(">")
    .map((seg) => {
      const [urlPart, namePart] = seg.split("|");
      const name = (namePart || urlPart || "").trim().replace(/[<>\u003e]/g, "");
      return name;
    })
    .filter((n) => n.length > 0 && n.toLowerCase() !== "tiles");
}

function matchSub(topSlug: string, name: string): SubDef | null {
  const top = TOP_BY_SLUG.get(topSlug);
  if (!top) return null;
  const norm = name.toLowerCase().replace(/\s+/g, " ").trim();
  for (const sub of top.subs) {
    if (sub.aliases.includes(norm)) return sub;
  }
  return null;
}

function assignPrimary(p: RawProduct): { top: string; sub: SubDef | null } {
  const entries = (p.unbxdCategoryPathId ?? [])
    .map(parseCategoryEntry)
    .filter((e) => e.length > 0);

  // Most specific wins: first entry whose 3rd segment matches a curated sub
  for (const entry of entries) {
    if (!entry[1]) continue;
    const topSlug = slugify(entry[0]);
    const top = TOP_BY_SLUG.get(topSlug);
    if (!top) continue;
    const sub = matchSub(topSlug, entry[1]);
    if (sub) return { top: topSlug, sub };
  }
  // Fallback: first entry's top-level
  for (const entry of entries) {
    const topSlug = slugify(entry[0]);
    if (TOP_BY_SLUG.has(topSlug)) return { top: topSlug, sub: null };
  }

  const area = p.tileArea?.[0]?.trim();
  if (area) {
    const byArea = TREE.find((t) => t.name.toLowerCase() === area.toLowerCase());
    if (byArea) return { top: byArea.slug, sub: null };
  }
  if (p.tileCategory?.toLowerCase() === "floors") return { top: "floor-tiles", sub: null };
  if (p.tileCategory?.toLowerCase() === "walls") return { top: "wall-tiles", sub: null };
  return { top: "floor-tiles", sub: null };
}

function cleanImages(p: RawProduct): { url: string; alt: string }[] {
  const candidates = [
    ...(p.imageUrl ?? []),
    p.Product_Image,
    p.smallImage,
    p.swatchImage,
    p.thumbnail,
    ...(p.tilesImages ? p.tilesImages.split(",") : []),
  ].filter(
    (u): u is string =>
      !!u &&
      u !== "no_selection" &&
      !u.includes("/no_selection") &&
      u.startsWith("http"),
  );

  const seen = new Set<string>();
  const urls: string[] = [];
  for (const u of candidates) {
    if (!seen.has(u)) {
      seen.add(u);
      urls.push(u);
    }
  }
  const alt = p.title || "Orientbell tile";
  return urls.slice(0, 8).map((url) => ({ url, alt }));
}

async function fetchPage(
  pId: string,
  start: number,
  rows: number,
): Promise<{ products: RawProduct[]; total: number }> {
  const url =
    `${BASE_URL}?p-id=${encodeURIComponent(pId)}` +
    `&facet.multiselect=true&spellcheck=true&pagetype=boolean&start=${start}` +
    `&rows=${rows}&version=V2&fallback=true&viewType=GRID&facet.version=V2`;

  const res = await fetch(url, {
    headers: { "unbxd-user-id": "shivaddi-import" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${pId} start=${start}`);
  const json = (await res.json()) as {
    response: { products?: RawProduct[]; numberOfProducts?: number };
  };
  return {
    products: json.response?.products ?? [],
    total: json.response?.numberOfProducts ?? 0,
  };
}

function skuOf(p: RawProduct): string {
  return p.sku || p.uniqueId || p.erpCode || "";
}

async function fetchAll(
  pId: string,
  label: string,
  onProgress?: (n: number) => void,
): Promise<Map<string, RawProduct>> {
  const rows = 100;
  const bySku = new Map<string, RawProduct>();
  let start = 0;
  for (;;) {
    const { products, total } = await fetchPage(pId, start, rows);
    for (const p of products) {
      const key = skuOf(p);
      if (key && !bySku.has(key)) bySku.set(key, p);
    }
    if (products.length < rows || start + rows >= (total || start + rows)) break;
    start += rows;
    onProgress?.(bySku.size);
    await new Promise((r) => setTimeout(r, 200));
  }
  console.log(`  ✓ ${label}: ${bySku.size}`);
  return bySku;
}

async function main() {
  console.log("🏗  Rebuilding Orientbell catalog (v3 – real tree)…");

  // ---------- Reset catalog (no mock data) ----------
  console.log("  wiping existing catalog…");
  await prisma.productImage.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  console.log("  ✓ wiped");

  // ---------- Fetch full catalog + every collection page ----------
  console.log("  fetching catalog…");
  const catalog = await fetchAll('categoryPathId:"/tiles"', "full catalog");
  console.log(`  ✓ ${catalog.size} unique products`);

  console.log("  fetching collection pages…");
  const membership = new Map<string, Set<string>>(); // top slug -> skus
  for (const top of TREE) {
    const page = await fetchAll(
      `categoryPathId:"/tiles/${top.slug}"`,
      top.slug,
    );
    membership.set(top.slug, new Set(page.keys()));
    await new Promise((r) => setTimeout(r, 150));
  }

  // ---------- Categories ----------
  const categoryRows: Prisma.CategoryCreateManyInput[] = [];
  const categoryIds = new Map<string, string>();
  const usedCatSlugs = new Set<string>();
  let catIdx = 0;
  for (const top of TREE) {
    const topId = crypto.randomUUID();
    categoryIds.set(top.slug, topId);
    usedCatSlugs.add(top.slug);
    categoryRows.push({
      id: topId,
      name: top.name,
      slug: top.slug,
      description: `${top.name} – premium quality tiles available at Shiv Aadi, Madhubani.`,
      displayOrder: catIdx++,
      published: true,
    });
    for (const sub of top.subs) {
      const subId = crypto.randomUUID();
      categoryIds.set(`${top.slug}/${sub.slug}`, subId);
      const uniqueSlug = usedCatSlugs.has(sub.slug)
        ? `${top.slug.replace(/-tiles$/, "")}-${sub.slug}`
        : sub.slug;
      usedCatSlugs.add(uniqueSlug);
      categoryRows.push({
        id: subId,
        name: sub.name,
        slug: uniqueSlug,
        parentId: topId,
        displayOrder: catIdx++,
        published: true,
      });
    }
  }
  await prisma.category.createMany({ data: categoryRows, skipDuplicates: true });
  console.log(`  ✓ ${categoryRows.length} categories created`);

  // ---------- Build product rows ----------
  const usedSlugs = new Map<string, number>();
  const productRows: Prisma.ProductCreateManyInput[] = [];
  const imageRows: Prisma.ProductImageCreateManyInput[] = [];
  let failed = 0;

  // Featured spread: first priced product of each collection
  const featuredByTop = new Map<string, string>(); // top -> sku
  const newsDates = [...catalog.values()]
    .map((p) => ({ p, d: p.newsFromDate ? new Date(p.newsFromDate).getTime() : 0 }))
    .sort((a, b) => b.d - a.d);

  for (const p of catalog.values()) {
    try {
      const name = p.title || p.metaTitle || "Untitled tile";
      let slug = slugify(name);
      const dup = usedSlugs.get(slug) ?? 0;
      usedSlugs.set(slug, dup + 1);
      if (dup > 0) slug = `${slug}-${dup}`;

      const { top, sub } = assignPrimary(p);
      const primaryId = sub ? categoryIds.get(`${top}/${sub.slug}`) : categoryIds.get(top);
      if (!primaryId) {
        failed++;
        continue;
      }

      const price = num(p.price) ?? num(p.List_Price);
      const priceDecimal = price != null ? new Prisma.Decimal(price) : null;
      const size = p.tileSize?.[0] ?? p.designCodeDescription ?? null;
      const tags = [
        ...(p.tileType ?? []),
        ...(p.tilesFinish ?? []),
        ...(p.tileDesign ?? []),
        ...(p.colors ?? []),
      ]
        .map((t) => t.toLowerCase().replace(/\s+/g, "-"))
        .filter((t) => t && t !== "no-selection");

      const images = cleanImages(p);
      const stock = p.availabilityLabel === "Out of Stock" ? "Out of Stock" : "In Stock";
      const shortDesc =
        p.metaDescription || p.designCodeDescription || `${name} – premium quality tile.`;

      const id = crypto.randomUUID();
      productRows.push({
        id,
        name,
        slug,
        sku: p.sku || p.uniqueId || p.erpCode || slug,
        categoryId: primaryId,
        subcategory: sub?.name ?? null,
        shortDescription: shortDesc,
        description: p.designCodeDescription || shortDesc,
        material: p.orientBody || "Vitrified",
        size,
        thickness: p.orientThickness || null,
        finish: p.tilesFinish?.[0] || null,
        colour: p.colors?.[0] || null,
        application: p.tileArea?.[0] || p.tileCategory || null,
        stockStatus: stock,
        price: priceDecimal,
        priceType: price != null ? "EXACT" : "ON_REQUEST",
        moq: p.packingCodeDescription || null,
        featured: false,
        isNew: false,
        tags,
        published: true,
        seoTitle: `${name} – Shiv Aadi | Mithila Tiles & Marbles House`,
        seoDescription: shortDesc,
      });
      for (const [i, img] of images.entries()) {
        imageRows.push({
          id: crypto.randomUUID(),
          productId: id,
          url: img.url,
          alt: img.alt,
          sortOrder: i,
          isThumbnail: i === 0,
        });
      }
    } catch (e) {
      failed++;
      if (failed <= 5) console.error("  !", (e as Error).message);
    }
  }

  // ---------- Map sku -> product row ----------
  const skuToRow = new Map<string, { id: string; top: string }>();
  for (const p of catalog.values()) {
    const row = productRows.find(
      (r) => r.sku === (p.sku || p.uniqueId || p.erpCode || slugify(p.title || "")),
    );
    if (row) skuToRow.set(skuOf(p), { id: row.id!, top: assignPrimary(p).top });
  }

  // ---------- Primary category distribution ----------
  const distByTop = new Map<string, number>();
  for (const v of skuToRow.values()) {
    distByTop.set(v.top, (distByTop.get(v.top) ?? 0) + 1);
  }
  console.log("\n  ── primary assignment ──");
  for (const top of TREE) {
    const n = distByTop.get(top.slug) ?? 0;
    if (n > 0) console.log(`  ${String(n).padStart(4)}  ${top.slug}`);
  }

  // ---------- ProductCategory links (real membership) ----------
  console.log("\n  ── collection membership ──");
  const linkRows: Prisma.ProductCategoryCreateManyInput[] = [];
  for (const top of TREE) {
    const skus = membership.get(top.slug) ?? new Set<string>();
    const catId = categoryIds.get(top.slug);
    if (!catId) continue;
    let added = 0;
    for (const sku of skus) {
      const row = skuToRow.get(sku);
      if (!row) continue;
      linkRows.push({
        id: crypto.randomUUID(),
        productId: row.id,
        categoryId: catId,
        sortOrder: added++,
      });
    }
    console.log(`  ${String(added).padStart(4)}  ${top.slug}`);
  }
  console.log(`  ✓ ${linkRows.length} category links`);

  // ---------- Featured / isNew ----------
  for (const top of TREE) {
    const skus = membership.get(top.slug) ?? new Set<string>();
    for (const sku of skus) {
      const row = skuToRow.get(sku);
      if (!row) continue;
      const r = productRows.find((x) => x.id === row.id);
      if (r && r.price && !featuredByTop.has(top.slug)) {
        featuredByTop.set(top.slug, row.id);
      }
    }
  }
  const featuredIds = new Set(featuredByTop.values());
  for (const row of productRows) {
    if (featuredIds.has(row.id!)) row.featured = true;
  }
  const newsIds = new Set<string>();
  for (const { p } of newsDates.slice(0, 24)) {
    const row = skuToRow.get(skuOf(p));
    if (row) newsIds.add(row.id);
  }
  for (const row of productRows) {
    if (newsIds.has(row.id!)) row.isNew = true;
  }
  console.log(
    `  ✓ ${productRows.length} products | featured: ${featuredIds.size} | isNew: ${newsIds.size} (${failed} failed)`,
  );

  // ---------- Bulk insert ----------
  const BATCH = 500;
  for (let i = 0; i < productRows.length; i += BATCH) {
    await prisma.product.createMany({
      data: productRows.slice(i, i + BATCH),
      skipDuplicates: true,
    });
  }
  console.log(`  ✓ ${productRows.length} products inserted`);
  for (let i = 0; i < imageRows.length; i += BATCH) {
    await prisma.productImage.createMany({
      data: imageRows.slice(i, i + BATCH),
      skipDuplicates: true,
    });
  }
  console.log(`  ✓ ${imageRows.length} product images inserted`);
  for (let i = 0; i < linkRows.length; i += BATCH) {
    await prisma.productCategory.createMany({
      data: linkRows.slice(i, i + BATCH),
      skipDuplicates: true,
    });
  }
  console.log(`  ✓ ${linkRows.length} category links inserted`);

  // ---------- Category images (first thumbnail of each collection) ----------
  const topWithImgs = await prisma.category.findMany({
    where: { parentId: null },
    include: { children: { select: { id: true } } },
  });
  for (const cat of topWithImgs) {
    const ids = [cat.id, ...cat.children.map((c) => c.id)];
    const img = await prisma.productImage.findFirst({
      where: { isThumbnail: true, product: { categoryId: { in: ids } } },
      orderBy: { sortOrder: "asc" },
      select: { url: true },
    });
    if (img) {
      await prisma.category.update({
        where: { id: cat.id },
        data: { image: img.url },
      });
    }
  }
  console.log("  ✓ category images set");

  console.log("✅ Orientbell import complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });