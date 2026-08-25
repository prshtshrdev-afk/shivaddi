/**
 * SHIV AADI — one-off: update site contact emails.
 * Run via: npm run email:update
 */
import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const EMAIL = "info@shivaadimithilatileshouse.com";

async function main() {
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
  for (const key of ["email", "b2bEmail"]) {
    const existing = await prisma.siteSetting.findUnique({ where: { key } });
    if (existing) {
      await prisma.siteSetting.update({ where: { key }, data: { value: EMAIL } });
      console.log(`  ✓ updated ${key} -> ${EMAIL}`);
    } else {
      await prisma.siteSetting.create({ data: { key, value: EMAIL, group: "contact" } });
      console.log(`  ✓ created ${key} -> ${EMAIL}`);
    }
  }
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("email:update failed:", err);
  process.exit(1);
});
