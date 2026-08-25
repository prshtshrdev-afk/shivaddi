import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const rows = await prisma.product.findMany({
    where: { images: { some: {} } },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 10 } },
    take: 5,
  });
  for (const p of rows) {
    console.log(p.slug, p.name, "->", p.images.length, "imgs");
    for (const i of p.images) {
      console.log("   ", i.isThumbnail ? "[T]" : "[ ]", i.url.slice(0, 110));
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());