import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { v2 as cloudinary } from "cloudinary";
import https from "https";
import { Readable } from "stream";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

function downloadImage(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download: ${res.statusCode}`));
        return;
      }
      const chunks: Buffer[] = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => resolve(Buffer.concat(chunks)));
    }).on("error", reject);
  });
}

function uploadToCloudinary(buffer: Buffer, publicId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: publicId,
        folder: "shivadii/products",
        resource_type: "image",
        quality: "auto:good",
        fetch_format: "auto",
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url);
      }
    );
    Readable.from(buffer).pipe(uploadStream);
  });
}

async function main() {
  const products = await prisma.product.findMany({
    include: { images: true },
  });

  console.log(`Processing ${products.length} products...`);

  let migrated = 0;
  let skipped = 0;
  let errors = 0;

  for (const product of products) {
    for (const image of product.images) {
      try {
        // Skip if already a Cloudinary URL
        if (image.url.includes("cloudinary.com")) {
          skipped++;
          continue;
        }

        // Download original image
        const buffer = await downloadImage(image.url);
        
        // Generate Cloudinary public ID
        const ext = image.url.split(".").pop()?.split("?")[0] || "webp";
        const publicId = `${product.slug}-${image.sortOrder}.${ext}`;

        // Upload to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(buffer, publicId);

        // Update database
        await prisma.productImage.update({
          where: { id: image.id },
          data: { url: cloudinaryUrl },
        });

        console.log(`✓ ${product.name} - image ${image.sortOrder}`);
        migrated++;

        // Rate limit
        await new Promise(r => setTimeout(r, 100));
      } catch (error) {
        console.error(`✗ ${product.name} - image ${image.sortOrder}:`, error);
        errors++;
      }
    }
  }

  console.log(`\nDone! Migrated: ${migrated}, Skipped: ${skipped}, Errors: ${errors}`);
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());