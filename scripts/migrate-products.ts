/**
 * Database Migration Script: Old PostgreSQL → New PostgreSQL
 *
 * Transfers categories, products, and product-category links.
 * Skips ProductImage table (images are in Cloudinary).
 * Uses small batch sizes to avoid network bandwidth issues.
 *
 * Run: npx tsx scripts/migrate-products.ts
 */
import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Database connection strings
const OLD_DB_URL = "postgresql://neondb_owner:npg_bBV8JyxcsP6L@ep-old-bird-b32o09op-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const NEW_DB_URL = "postgresql://neondb_owner:npg_iB3mKr1UvGzj@ep-crimson-sound-ayjtj01a-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const oldPrisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: OLD_DB_URL }),
});

const newPrisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: NEW_DB_URL }),
});

const BATCH_SIZE = 50;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log("🚀 Starting database migration (categories + products only)...\n");

  try {
    // Test old database connection
    console.log("1️⃣  Testing old database connection...");
    const test = await oldPrisma.product.count();
    console.log(`   ✅ Old DB connected. Found ${test} products\n`);

    // Migrate Categories
    console.log("2️⃣  Migrating categories...");
    const catCount = await migrateCategories();
    console.log(`   ✅ ${catCount} categories migrated\n`);

    // Migrate Products (only published ones to reduce data)
    console.log("3️⃣  Migrating products...");
    const prodCount = await migrateProducts();
    console.log(`   ✅ ${prodCount} products migrated\n`);

    // Migrate Product-Category Links
    console.log("4️⃣  Migrating product-category links...");
    const linkCount = await migrateProductCategoryLinks();
    console.log(`   ✅ ${linkCount} links migrated\n`);

    // Verify
    console.log("5️⃣  Verifying...");
    await verifyMigration();

    console.log("\n🎉 Migration completed successfully!");

  } catch (error: any) {
    if (error.message?.includes("data transfer quota")) {
      console.error("\n❌ Old database ka data transfer quota abhi bhi exceed hai.");
      console.error("   Neon free tier ka quota monthly reset hota hai.");
      console.error("   Ya Neon Console se CSV export karo (pehle bataya tha).");
    } else {
      console.error("\n❌ Migration failed:", error.message);
    }
  } finally {
    await oldPrisma.$disconnect();
    await newPrisma.$disconnect();
  }
}

async function migrateCategories(): Promise<number> {
  const categories = await oldPrisma.category.findMany({
    orderBy: { displayOrder: 'asc' },
  });

  console.log(`   Found ${categories.length} categories`);

  for (let i = 0; i < categories.length; i += BATCH_SIZE) {
    const batch = categories.slice(i, i + BATCH_SIZE);
    console.log(`   Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(categories.length / BATCH_SIZE)}...`);

    await newPrisma.category.createMany({
      data: batch.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        parentId: cat.parentId,
        displayOrder: cat.displayOrder,
        published: cat.published,
        createdAt: cat.createdAt,
        updatedAt: cat.updatedAt,
      })),
      skipDuplicates: true,
    });

    await sleep(100);
  }

  return categories.length;
}

async function migrateProducts(): Promise<number> {
  const totalCount = await oldPrisma.product.count();
  console.log(`   Found ${totalCount} products`);

  let processed = 0;
  for (let offset = 0; offset < totalCount; offset += BATCH_SIZE) {
    const products = await oldPrisma.product.findMany({
      skip: offset,
      take: BATCH_SIZE,
      orderBy: { createdAt: 'asc' },
    });

    console.log(`   Batch ${Math.floor(offset / BATCH_SIZE) + 1}/${Math.ceil(totalCount / BATCH_SIZE)} (${processed + products.length}/${totalCount})...`);

    await newPrisma.product.createMany({
      data: products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        categoryId: p.categoryId,
        subcategory: p.subcategory,
        description: p.description,
        shortDescription: p.shortDescription,
        material: p.material,
        size: p.size,
        thickness: p.thickness,
        finish: p.finish,
        colour: p.colour,
        application: p.application,
        stockStatus: p.stockStatus,
        price: p.price,
        priceType: p.priceType,
        moq: p.moq,
        featured: p.featured,
        isNew: p.isNew,
        tags: p.tags,
        published: p.published,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      skipDuplicates: true,
    });

    processed += products.length;
    await sleep(100);
  }

  return processed;
}

async function migrateProductCategoryLinks(): Promise<number> {
  const totalCount = await oldPrisma.productCategory.count();
  console.log(`   Found ${totalCount} links`);

  let processed = 0;
  for (let offset = 0; offset < totalCount; offset += BATCH_SIZE) {
    const links = await oldPrisma.productCategory.findMany({
      skip: offset,
      take: BATCH_SIZE,
    });

    console.log(`   Batch ${Math.floor(offset / BATCH_SIZE) + 1}/${Math.ceil(totalCount / BATCH_SIZE)} (${processed + links.length}/${totalCount})...`);

    await newPrisma.productCategory.createMany({
      data: links.map(link => ({
        id: link.id,
        productId: link.productId,
        categoryId: link.categoryId,
        sortOrder: link.sortOrder,
        createdAt: link.createdAt,
      })),
      skipDuplicates: true,
    });

    processed += links.length;
    await sleep(100);
  }

  return processed;
}

async function verifyMigration() {
  const oldStats = {
    products: await oldPrisma.product.count(),
    categories: await oldPrisma.category.count(),
    links: await oldPrisma.productCategory.count(),
  };

  const newStats = {
    products: await newPrisma.product.count(),
    categories: await newPrisma.category.count(),
    links: await newPrisma.productCategory.count(),
  };

  console.log("   Old Database:");
  console.log(`     Products: ${oldStats.products}`);
  console.log(`     Categories: ${oldStats.categories}`);
  console.log(`     Links: ${oldStats.links}`);

  console.log("\n   New Database:");
  console.log(`     Products: ${newStats.products}`);
  console.log(`     Categories: ${newStats.categories}`);
  console.log(`     Links: ${newStats.links}`);

  if (newStats.products >= oldStats.products &&
      newStats.categories >= oldStats.categories) {
    console.log("\n   ✅ Migration verification passed!");
  } else {
    console.log("\n   ⚠️  Some data may be missing. Check logs.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});