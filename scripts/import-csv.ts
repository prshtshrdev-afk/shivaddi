/**
 * Import CSV files into new database
 *
 * CSV files should be placed in scripts/exports/ folder:
 *   - categories.csv
 *   - products.csv
 *   - product_images.csv
 *   - product_category_links.csv
 *
 * Run: npx tsx scripts/import-csv.ts
 */
import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";

const NEW_DB_URL = "postgresql://neondb_owner:npg_iB3mKr1UvGzj@ep-crimson-sound-ayjtj01a-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const newPrisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: NEW_DB_URL }),
});

const EXPORTS_DIR = path.join(__dirname, "exports");
const BATCH_SIZE = 50;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}

function readCsv(filename: string): string[][] {
  const filePath = path.join(EXPORTS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  File not found: ${filename}`);
    return [];
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]);
  const rows: string[][] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const row: string[] = [];
    for (const h of headers) {
      const idx = headers.indexOf(h);
      row.push(values[idx] ?? "");
    }
    rows.push(row);
  }

  return rows;
}

function csvToObject<T>(filename: string): T[] {
  const filePath = path.join(EXPORTS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`   ⚠️  File not found: ${filename}`);
    return [];
  }
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n").filter((l) => l.trim());
  if (lines.length === 0) return [];

  const headers = parseCsvLine(lines[0]);
  const rows: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const obj: any = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = values[j] ?? "";
    }
    rows.push(obj);
  }

  return rows;
}

function cleanValue(val: string): string | null {
  if (val === "" || val === "null" || val === "NULL" || val === undefined) return null;
  return val;
}

function cleanBool(val: string): boolean {
  return val === "true" || val === "1" || val === "t";
}

function cleanInt(val: string): number {
  const n = parseInt(val, 10);
  return isNaN(n) ? 0 : n;
}

function cleanDecimal(val: string): Prisma.Decimal | null {
  if (!val || val === "null" || val === "NULL") return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : new Prisma.Decimal(n);
}

function cleanStringArray(val: string): string[] {
  if (!val || val === "{}" || val === "null") return [];
  // Handle PostgreSQL array format: {val1,val2}
  return val
    .replace(/^{|}$/g, "")
    .split(",")
    .map((s) => s.trim().replace(/^"|"$/g, ""))
    .filter((s) => s.length > 0);
}

async function main() {
  console.log("📥 Starting CSV import to new database...\n");

  try {
    // Check exports directory
    if (!fs.existsSync(EXPORTS_DIR)) {
      fs.mkdirSync(EXPORTS_DIR, { recursive: true });
      console.log(`📁 Created exports directory: ${EXPORTS_DIR}`);
      console.log("   Please place CSV files there and run again.\n");
      return;
    }

    // Step 1: Import Categories
    console.log("1️⃣  Importing categories...");
    const categories = csvToObject<any>("categories.csv");
    if (categories.length === 0) {
      console.log("   ⚠️  No categories found. Skipping...\n");
    } else {
      console.log(`   Found ${categories.length} categories in CSV`);
      await importCategories(categories);
      console.log("   ✅ Categories imported\n");
    }

    // Step 2: Import Products
    console.log("2️⃣  Importing products...");
    const products = csvToObject<any>("products.csv");
    if (products.length === 0) {
      console.log("   ⚠️  No products found. Skipping...\n");
    } else {
      console.log(`   Found ${products.length} products in CSV`);
      await importProducts(products);
      console.log("   ✅ Products imported\n");
    }

    // Step 3: Import Product Images
    console.log("3️⃣  Importing product images...");
    const images = csvToObject<any>("product_images.csv");
    if (images.length === 0) {
      console.log("   ⚠️  No product images found. Skipping...\n");
    } else {
      console.log(`   Found ${images.length} product images in CSV`);
      await importProductImages(images);
      console.log("   ✅ Product images imported\n");
    }

    // Step 4: Import Product-Category Links
    console.log("4️⃣  Importing product-category links...");
    const links = csvToObject<any>("product_category_links.csv");
    if (links.length === 0) {
      console.log("   ⚠️  No product-category links found. Skipping...\n");
    } else {
      console.log(`   Found ${links.length} product-category links in CSV`);
      await importProductCategoryLinks(links);
      console.log("   ✅ Product-category links imported\n");
    }

    // Step 5: Verify
    console.log("5️⃣  Verifying import...");
    await verifyImport();

    console.log("\n🎉 Import completed successfully!");

  } catch (error) {
    console.error("\n❌ Import failed:", error);
    throw error;
  } finally {
    await newPrisma.$disconnect();
  }
}

async function importCategories(categories: any[]) {
  const BATCH = 50;
  for (let i = 0; i < categories.length; i += BATCH) {
    const batch = categories.slice(i, i + BATCH);
    console.log(`   Processing batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(categories.length / BATCH)}...`);

    await newPrisma.category.createMany({
      data: batch.map((cat) => ({
        id: cleanValue(cat.id) || undefined,
        name: cleanValue(cat.name) || "Untitled",
        slug: cleanValue(cat.slug) || "untitled",
        description: cleanValue(cat.description),
        image: cleanValue(cat.image),
        parentId: cleanValue(cat.parentId),
        displayOrder: cleanInt(cat.displayOrder ?? "0"),
        published: cleanBool(cat.published ?? "true"),
      })),
      skipDuplicates: true,
    });

    await sleep(100);
  }
}

async function importProducts(products: any[]) {
  const BATCH = 50;
  for (let i = 0; i < products.length; i += BATCH) {
    const batch = products.slice(i, i + BATCH);
    console.log(`   Processing batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(products.length / BATCH)}...`);

    await newPrisma.product.createMany({
      data: batch.map((p) => ({
        id: cleanValue(p.id) || undefined,
        name: cleanValue(p.name) || "Untitled",
        slug: cleanValue(p.slug) || "untitled",
        sku: cleanValue(p.sku),
        categoryId: cleanValue(p.categoryId),
        subcategory: cleanValue(p.subcategory),
        description: cleanValue(p.description),
        shortDescription: cleanValue(p.shortDescription),
        material: cleanValue(p.material),
        size: cleanValue(p.size),
        thickness: cleanValue(p.thickness),
        finish: cleanValue(p.finish),
        colour: cleanValue(p.colour),
        application: cleanValue(p.application),
        stockStatus: cleanValue(p.stockStatus) || "In Stock",
        price: cleanDecimal(p.price),
        priceType: (cleanValue(p.priceType) as any) || "ON_REQUEST",
        moq: cleanValue(p.moq),
        featured: cleanBool(p.featured ?? "false"),
        isNew: cleanBool(p.isNew ?? "false"),
        tags: cleanStringArray(p.tags),
        published: cleanBool(p.published ?? "false"),
        seoTitle: cleanValue(p.seoTitle),
        seoDescription: cleanValue(p.seoDescription),
      })),
      skipDuplicates: true,
    });

    await sleep(100);
  }
}

async function importProductImages(images: any[]) {
  const BATCH = 100;
  for (let i = 0; i < images.length; i += BATCH) {
    const batch = images.slice(i, i + BATCH);
    console.log(`   Processing batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(images.length / BATCH)}...`);

    await newPrisma.productImage.createMany({
      data: batch.map((img) => ({
        id: cleanValue(img.id) || undefined,
        productId: cleanValue(img.productId) || "",
        url: cleanValue(img.url) || "",
        alt: cleanValue(img.alt),
        sortOrder: cleanInt(img.sortOrder ?? "0"),
        isThumbnail: cleanBool(img.isThumbnail ?? "false"),
      })),
      skipDuplicates: true,
    });

    await sleep(100);
  }
}

async function importProductCategoryLinks(links: any[]) {
  const BATCH = 100;
  for (let i = 0; i < links.length; i += BATCH) {
    const batch = links.slice(i, i + BATCH);
    console.log(`   Processing batch ${Math.floor(i / BATCH) + 1}/${Math.ceil(links.length / BATCH)}...`);

    await newPrisma.productCategory.createMany({
      data: batch.map((link) => ({
        id: cleanValue(link.id) || undefined,
        productId: cleanValue(link.productId) || "",
        categoryId: cleanValue(link.categoryId) || "",
        sortOrder: cleanInt(link.sortOrder ?? "0"),
      })),
      skipDuplicates: true,
    });

    await sleep(100);
  }
}

async function verifyImport() {
  const stats = {
    categories: await newPrisma.category.count(),
    products: await newPrisma.product.count(),
    images: await newPrisma.productImage.count(),
    links: await newPrisma.productCategory.count(),
  };

  console.log("   New Database:");
  console.log(`     Categories: ${stats.categories}`);
  console.log(`     Products: ${stats.products}`);
  console.log(`     Images: ${stats.images}`);
  console.log(`     Links: ${stats.links}`);

  if (stats.products > 0 && stats.categories > 0) {
    console.log("\n   ✅ Import verification passed!");
  } else {
    console.log("\n   ⚠️  Import verification shows low counts. Check CSV files.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});