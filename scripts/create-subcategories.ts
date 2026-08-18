import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

// Define subcategories for categories that have many images but no subcategories
const subcategoryMap: Record<string, { name: string; slug: string; description: string }[]> = {
  "3d-tiles": [
    { name: "3D Wall Tiles", slug: "3d-wall-tiles", description: "Three-dimensional wall tiles with raised patterns" },
    { name: "3D Floor Tiles", slug: "3d-floor-tiles", description: "Three-dimensional floor tiles with depth effects" },
    { name: "3D Mosaic Tiles", slug: "3d-mosaic-tiles", description: "Mosaic tiles with 3D geometric patterns" },
    { name: "3D Decorative Tiles", slug: "3d-decorative-tiles", description: "Decorative 3D accent tiles for feature walls" },
    { name: "3D Textured Tiles", slug: "3d-textured-tiles", description: "Textured tiles with 3D surface relief" },
  ],
  "texture-tiles": [
    { name: "Stone Texture Tiles", slug: "stone-texture-tiles", description: "Natural stone texture finish tiles" },
    { name: "Wood Texture Tiles", slug: "wood-texture-tiles", description: "Wood grain texture ceramic tiles" },
    { name: "Concrete Texture Tiles", slug: "concrete-texture-tiles", description: "Industrial concrete texture finish" },
    { name: "Fabric Texture Tiles", slug: "fabric-texture-tiles", description: "Fabric and textile texture finish tiles" },
    { name: "Metallic Texture Tiles", slug: "metallic-texture-tiles", description: "Metallic finish textured tiles" },
  ],
  "accent-tiles": [
    { name: "Border Tiles", slug: "border-tiles", description: "Decorative border and listello tiles" },
    { name: "Feature Wall Tiles", slug: "feature-wall-tiles", description: "Statement tiles for accent walls" },
    { name: "Decorative Inserts", slug: "decorative-inserts", description: "Small decorative tile inserts and accents" },
    { name: "Listello Tiles", slug: "listello-tiles", description: "Decorative listello border tiles" },
    { name: "Medallion Tiles", slug: "medallion-tiles", description: "Centerpiece medallion decorative tiles" },
  ],
  "elevation-tiles": [
    { name: "Exterior Wall Tiles", slug: "exterior-wall-tiles", description: "Weather-resistant elevation tiles" },
    { name: "Facade Tiles", slug: "facade-tiles", description: "Building facade cladding tiles" },
    { name: "Outdoor Elevation Tiles", slug: "outdoor-elevation-tiles", description: "Outdoor elevation and cladding tiles" },
    { name: "Boundary Wall Tiles", slug: "boundary-wall-tiles", description: "Boundary and compound wall tiles" },
    { name: "Pillar Cladding Tiles", slug: "pillar-cladding-tiles", description: "Pillar and column cladding tiles" },
  ],
  "flexi-tiles": [
    { name: "Flexible Mosaic", slug: "flexible-mosaic", description: "Flexible mosaic tile sheets" },
    { name: "Bendable Tiles", slug: "bendable-tiles", description: "Flexible tiles for curved surfaces" },
    { name: "Flexi Mosaic Sheets", slug: "flexi-mosaic-sheets", description: "Flexible mosaic tile sheets for curves" },
    { name: "Rubber Tiles", slug: "rubber-tiles", description: "Flexible rubber flooring tiles" },
    { name: "PVC Flexible Tiles", slug: "pvc-flexible-tiles", description: "PVC flexible tile options" },
  ],
  "subway-tiles": [
    { name: "Classic Subway", slug: "classic-subway", description: "Classic rectangular subway tiles" },
    { name: "Beveled Subway", slug: "beveled-subway", description: "Beveled edge subway tiles" },
    { name: "Colored Subway", slug: "colored-subway", description: "Colored subway tile options" },
    { name: "Glass Subway", slug: "glass-subway", description: "Glass subway tiles for backsplash" },
    { name: "Large Format Subway", slug: "large-format-subway", description: "Large format subway tile variations" },
  ],
  "large-tiles": [
    { name: "800x1600 Slabs", slug: "800x1600-slabs", description: "Large format 800x1600mm tiles" },
    { name: "1200x2400 Slabs", slug: "1200x2400-slabs", description: "Extra large 1200x2400mm slabs" },
    { name: "600x1200 Tiles", slug: "600x1200-tiles", description: "Large format 600x1200mm tiles" },
    { name: "1000x1000 Tiles", slug: "1000x1000-tiles", description: "Square large format tiles" },
    { name: "1200x1200 Tiles", slug: "1200x1200-tiles", description: "Large square format tiles" },
  ],
  "anti-skid-tiles": [
    { name: "R10 Anti-Skid", slug: "r10-anti-skid", description: "R10 rated anti-slip tiles" },
    { name: "R11 Anti-Skid", slug: "r11-anti-skid", description: "R11 rated high anti-slip tiles" },
    { name: "R12 Anti-Skid", slug: "r12-anti-skid", description: "R12 rated maximum anti-slip tiles" },
    { name: "Wet Area Anti-Skid", slug: "wet-area-anti-skid", description: "Anti-skid tiles for wet areas" },
    { name: "Outdoor Anti-Skid", slug: "outdoor-anti-skid", description: "Outdoor rated anti-skid tiles" },
  ],
  "vitrified-tiles": [
    { name: "Double Charge Vitrified", slug: "double-charge-vitrified", description: "Double charge vitrified tiles" },
    { name: "Full Body Vitrified", slug: "full-body-vitrified", description: "Full body vitrified tiles" },
    { name: "Glazed Vitrified (GVT)", slug: "glazed-vitrified-gvt", description: "Glazed vitrified tiles" },
    { name: "Polished Vitrified", slug: "polished-vitrified", description: "High gloss polished vitrified" },
    { name: "Nano Vitrified", slug: "nano-vitrified", description: "Nano technology vitrified tiles" },
  ],
  "ceramic-tiles": [
    { name: "Wall Ceramic Tiles", slug: "wall-ceramic-tiles", description: "Ceramic tiles for walls" },
    { name: "Floor Ceramic Tiles", slug: "floor-ceramic-tiles", description: "Ceramic tiles for floors" },
    { name: "Glazed Ceramic", slug: "glazed-ceramic", description: "Glazed ceramic tile options" },
    { name: "Matte Ceramic", slug: "matte-ceramic", description: "Matte finish ceramic tiles" },
    { name: "Digital Ceramic", slug: "digital-ceramic", description: "Digitally printed ceramic tiles" },
  ],
  "granite-tiles": [
    { name: "Black Granite", slug: "black-granite", description: "Black granite tile options" },
    { name: "White Granite", slug: "white-granite", description: "White granite tile options" },
    { name: "Colored Granite", slug: "colored-granite", description: "Multi-colored granite tiles" },
    { name: "Flamed Granite", slug: "flamed-granite", description: "Flamed finish granite tiles" },
    { name: "Polished Granite", slug: "polished-granite", description: "High gloss polished granite" },
  ],
  "marble-tiles": [
    { name: "White Marble", slug: "white-marble", description: "White marble tile options" },
    { name: "Beige Marble", slug: "beige-marble", description: "Beige and cream marble tiles" },
    { name: "Black Marble", slug: "black-marble", description: "Black marble tile options" },
    { name: "Colored Marble", slug: "colored-marble", description: "Multi-colored marble tiles" },
    { name: "Veined Marble", slug: "veined-marble", description: "Veined marble tile patterns" },
  ],
};

async function main() {
  for (const [parentSlug, subcats] of Object.entries(subcategoryMap)) {
    const parent = await prisma.category.findUnique({
      where: { slug: parentSlug },
    });
    
    if (!parent) {
      console.log(`Parent category not found: ${parentSlug}`);
      continue;
    }
    
    console.log(`\nProcessing ${parent.name} (${parentSlug})...`);
    
    for (const sub of subcats) {
      const existing = await prisma.category.findUnique({ where: { slug: sub.slug } });
      if (existing) {
        console.log(`  ✓ ${sub.name} already exists`);
        continue;
      }
      
      await prisma.category.create({
        data: {
          name: sub.name,
          slug: sub.slug,
          description: sub.description,
          parentId: parent.id,
          displayOrder: 0,
          published: true,
        },
      });
      console.log(`  ✓ Created ${sub.name} (${sub.slug})`);
    }
  }
  
  console.log("\n✅ Subcategory creation complete!");
}

main()
  .catch(console.error)
  .finally(async () => await prisma.$disconnect());