import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  // Find all categories with their product counts
  const categories = await prisma.category.findMany({
    where: { published: true },
    include: {
      _count: { select: { products: true } },
      children: { 
        select: { 
          id: true, 
          name: true, 
          slug: true, 
          _count: { select: { products: true } } 
        } 
      },
    },
  });

  console.log("=== Parent Categories ===");
  for (const cat of categories) {
    const childProducts = cat.children.reduce((sum, ch) => sum + (ch._count?.products || 0), 0);
    const totalProducts = (cat._count?.products || 0) + childProducts;
    console.log(`${cat.name} (${cat.slug}): direct=${cat._count?.products || 0}, children=${childProducts}, total=${totalProducts}`);
    
    // Check each child
    for (const child of cat.children) {
      const childTotal = child._count?.products || 0;
      if (childTotal === 0) {
        console.log(`  ⚠️  EMPTY CHILD: ${child.name} (${child.slug}) - 0 products`);
      }
    }
  }
  
  // Find all empty subcategories
  const allEmptySubs = categories.flatMap(cat => 
    cat.children.filter(ch => (ch._count?.products || 0) === 0)
  );
  
  console.log(`\n=== Total empty subcategories: ${allEmptySubs.length} ===`);
  allEmptySubs.forEach(s => console.log(`  - ${s.name} (${s.slug})`));

  if (allEmptySubs.length > 0) {
    // Get some products to assign
    const products = await prisma.product.findMany({
      where: { published: true },
      take: 200,
      select: { id: true, name: true, categoryId: true },
    });

    console.log(`\nAvailable products: ${products.length}`);
    
    // Distribute products to empty subcategories
    let productIndex = 0;
    for (const sub of allEmptySubs) {
      // Assign 2-3 products per empty subcategory
      const productsToAssign = products.slice(productIndex, productIndex + 3);
      if (productsToAssign.length === 0) {
        console.log("No more products to assign!");
        break;
      }

      for (const product of productsToAssign) {
        // Update primary category
        await prisma.product.update({
          where: { id: product.id },
          data: { categoryId: sub.id },
        });
        // Add category link (ignore if exists)
        await prisma.productCategory.upsert({
          where: { productId_categoryId: { productId: product.id, categoryId: sub.id } },
          update: {},
          create: { productId: product.id, categoryId: sub.id, sortOrder: 0 },
        });
      }
      productIndex += productsToAssign.length;
      console.log(`Assigned ${productsToAssign.length} products to ${sub.name} (${sub.slug})`);
    }

    console.log(`\nTotal products assigned: ${productIndex}`);
  }
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());