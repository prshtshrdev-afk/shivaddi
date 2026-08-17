/**
 * SHIV AADI – seed script
 * Runs via: npx prisma db seed
 * (configured in prisma.config.ts -> migrations.seed)
 *
 * NOTE: The product catalog is NOT seeded here — it is imported from the
 * real Orientbell catalog via `npm run db:import` (scripts/import-orientbell.ts).
 * This script only seeds site content: admin user, settings, page content,
 * testimonials, blog posts, projects and gallery images.
 */
import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const img = (id: string) =>
  `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;

const PRODUCT_IMAGES = {
  whiteMarble: img("photo-1541963463532-d68292c34b19"),
  italianMarble: img("photo-1523626752472-b55a628f1acc"),
  blackGranite: img("photo-1600566753376-12c8ab7fb75b"),
  bathroomTile: img("photo-1556909212-d5b604d0c90d"),
  kitchenTile: img("photo-1556909114-f6e7ad7d3136"),
  woodTile: img("photo-1616486338812-3dadae4b4ace"),
  floorTile: img("photo-1600566753086-00f18fb6b3ea"),
  outdoorTile: img("photo-1558618666-fcd25c85cd64"),
  luxuryBath: img("photo-1552321554-5fefe8c9ef14"),
  venatoMarble: img("photo-1544531586-fde5298cdd40"),
  porcelain: img("photo-1600210492486-724fe5c67fb0"),
  spa: img("photo-1584622650111-993a426fbf0a"),
  hero1: img("photo-1600585154340-be6161a56a0c"),
  hero2: img("photo-1600607687939-ce8a6c25118c"),
  hero3: img("photo-1618221195710-dd6b41faaea6"),
  about: img("photo-1600585153490-76fb20a32601"),
  interior1: img("photo-1615874959474-d609969a20ed"),
  interior2: img("photo-1616594039964-ae9021a400a0"),
  project1: img("photo-1600607687920-4e2a09cf159d"),
};

async function main() {
  console.log("🌱 Seeding SHIV AADI database…");

  // ---------- Admin user ----------
  const adminEmail = "admin@shivaadi.in";
  const passwordHash = await bcrypt.hash("change-me-now", 12);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Shiv Aadi Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
    },
  });
  console.log("  ✓ Admin user (admin@shivaadi.in / change-me-now)");

  // ---------- Site settings ----------
  const settings: [string, string, string][] = [
    ["companyName", "Shiv Aadi", "company"],
    ["companyTagline", "Mithila Tiles & Marbles House", "company"],
    ["companyLegalName", "SHIV AADI MITHILA TILES & MARBLES HOUSE", "company"],
    ["gstin", "07AVUPJ6072E1Z9", "company"],
    ["establishedYear", "2010", "company"],
    ["phone", "+91 8595253597", "contact"],
    ["phoneDisplay", "+91 85952 53597 / +91 80803 53597", "contact"],
    ["whatsapp", "918595253597", "contact"],
    ["email", "shivaadiallinonemarblehouse@gmail.com", "contact"],
    ["b2bEmail", "shivaadiallinonemarblehouse@gmail.com", "contact"],
    ["address", "Anumandal Road, Benipatti, Near Aditya Vision & Registry Office, Madhubani, Bihar 847223, India", "contact"],
    ["addressShort", "Anumandal Road, Benipatti, Madhubani, Bihar 847223", "contact"],
    ["mapsUrl", "https://maps.google.com/?q=Benipatti,Madhubani,Bihar", "contact"],
    ["hours", "Mon – Sat: 9:30 AM – 8:00 PM | Sun: 10:00 AM – 2:00 PM", "contact"],
    ["instagram", "https://instagram.com/shivaadi", "social"],
    ["facebook", "https://facebook.com/shivaadi", "social"],
    ["youtube", "https://youtube.com/@shivaadi", "social"],
    ["heroBadge", "Since 2010 · Trusted by Builders & Architects", "homepage"],
    ["heroKicker", "Premium Tiles · Marble · Sanitaryware · Granite", "homepage"],
    ["heroTitle", "Crafting India's Finest Spaces, One Surface at a Time", "homepage"],
    ["heroDescription",
      "From marble showrooms to large-format tiles, Shiv Aadi brings premium surfaces and honest B2B pricing to builders, architects and homeowners across Bihar & Jharkhand.",
      "homepage"],
    ["b2bCtaTitle", "Looking for Tiles & Marble for Your Next Project?", "homepage"],
    ["b2bCtaDescription",
      "Get competitive wholesale pricing, expert material guidance and reliable supply for projects of every scale.",
      "homepage"],
    ["aboutHeading", "The Shiv Aadi Story", "homepage"],
    ["aboutDescription",
      "Founded in the heart of Mithila, Shiv Aadi began as a single marble yard and grew into one of the region's most trusted tile, marble, granite and sanitaryware houses. Every slab is hand-inspected. Every batch is priced with builders in mind. Our showroom is designed like a luxury interior — so you experience materials the way they will live in your spaces.",
      "homepage"],
    ["whyHeading", "Why Choose Shiv Aadi", "homepage"],
    ["collectionHeading", "Premium Collections", "homepage"],
    ["testimonialHeading", "What Our Clients Say", "homepage"],
    ["footerAbout",
      "Shiv Aadi – Mithila Tiles & Marbles House. Premium tiles, marble, granite and sanitaryware for homes and businesses across India.",
      "footer"],
    ["footerCopyright", "© {year} Shiv Aadi – Mithila Tiles & Marbles House. All rights reserved.", "footer"],
    ["seoTitle", "Shiv Aadi | Mithila Tiles & Marbles House – Premium Tiles, Marble, Granite & Sanitaryware", "seo"],
    ["seoDescription",
      "Premium tiles, marble, granite and sanitaryware in Madhubani, Bihar. B2B wholesale pricing for builders, architects and dealers. Visit our showroom or request a quote.",
      "seo"],
  ];
  for (const [key, value, group] of settings) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value, group },
      create: { key, value, group },
    });
  }
  console.log(`  ✓ ${settings.length} site settings`);

  // ---------- Page content ----------
  const whyUs = [
    { icon: "gem", title: "Premium Quality", text: "Every tile, slab and fitting is hand-inspected before it enters our yard." },
    { icon: "layers", title: "Wide Product Range", text: "Tiles, marbles, granite, sanitaryware and accessories under one roof." },
    { icon: "badge", title: "Competitive B2B Pricing", text: "Direct distributor pricing for builders, dealers and contractors." },
    { icon: "heart", title: "Trusted Service", text: "A decade of fulfilled promises and repeat clients across the region." },
    { icon: "compass", title: "Expert Guidance", text: "Material selection, quantity estimation and installation advice, free." },
    { icon: "truck", title: "Reliable Supply", text: "Truckload dispatch on schedule — bulk orders handled end to end." },
  ];
  for (const [i, item] of whyUs.entries()) {
    await prisma.pageContent.upsert({
      where: { page_section_key: { page: "home", section: "why-us", key: `item-${i}` } },
      update: { content: JSON.stringify(item) },
      create: { page: "home", section: "why-us", key: `item-${i}`, content: JSON.stringify(item) },
    });
  }

  const stats = [
    { value: "15+", label: "Years of Excellence" },
    { value: "5000+", label: "Happy Clients" },
    { value: "200+", label: "Projects Delivered" },
    { value: "40+", label: "Premium Brands" },
  ];
  for (const [i, item] of stats.entries()) {
    await prisma.pageContent.upsert({
      where: { page_section_key: { page: "home", section: "stats", key: `item-${i}` } },
      update: { content: JSON.stringify(item) },
      create: { page: "home", section: "stats", key: `item-${i}`, content: JSON.stringify(item) },
    });
  }

  const testimonials = [
    {
      clientName: "Rakesh Ranjan",
      company: "RR Constructions, Darbhanga",
      content:
        "We have been sourcing all marble and tiles from Shiv Aadi for over five years. Pricing is transparent and the quality never varies between batches — that matters at our scale.",
      rating: 5,
    },
    {
      clientName: "Arch. Sanjana Mehta",
      company: "Studio Manthan, Patna",
      content:
        "The showroom experience is like walking through a finished home. My clients see exactly how materials behave in light. The guidance on large-format slabs has saved us on multiple sites.",
      rating: 5,
    },
    {
      clientName: "Deepak Agarwal",
      company: "Agarwal Realty, Muzaffarpur",
      content:
        "For our 4-tower residential project, Shiv Aadi handled delivery of 40,000 sq.ft of tiles without a single delay. Their bulk pricing beat every quote we received.",
      rating: 5,
    },
  ];
  for (const [i, t] of testimonials.entries()) {
    await prisma.testimonial.upsert({
      where: { id: `seed-t-${i}` },
      update: { ...t, sortOrder: i },
      create: { id: `seed-t-${i}`, ...t, sortOrder: i, published: true },
    });
  }
  console.log("  ✓ Home content (why-us, stats), testimonials");

  // ---------- Blog posts ----------
  const posts = [
    {
      title: "Marble vs Granite: The Complete Selection Guide",
      slug: "marble-vs-granite-selection-guide",
      excerpt:
        "Choosing between marble and granite for your project? We break down cost, durability, maintenance and the right use case for each stone.",
      content:
        "<p>Marble and granite are the two most specified stones in Indian architecture — but they serve very different purposes.</p><h2>Marble</h2><p>Marble is a metamorphic stone prized for its veining, translucency and timeless elegance. It is softer than granite, absorbs moisture more readily, and etches when exposed to acidic substances. Use marble in living rooms, bedrooms, temples and luxury lobbies — anywhere aesthetics matter more than heavy traffic.</p><h2>Granite</h2><p>Granite is an igneous rock that ranks far higher on hardness. It resists scratches, stains and heat, making it the default choice for kitchen countertops, staircases and commercial flooring.</p><h2>How to decide</h2><ul><li><strong>Budget:</strong> Indian granite starts lower than Indian marble; imported designer varieties of both are premium.</li><li><strong>Use:</strong> Kitchen countertop → granite. Feature wall / pooja room → marble.</li><li><strong>Maintenance:</strong> Seal marble yearly; granite needs far less care.</li></ul><p>Visit our showroom to feel both stones under natural light — the tactile difference is the real deciding factor.</p>",
      featuredImage: PRODUCT_IMAGES.blackGranite,
    },
    {
      title: "Best Tiles for Bathrooms in 2026: A Buyer's Guide",
      slug: "best-tiles-for-bathrooms-guide",
      excerpt:
        "From anti-skid ratings to water absorption — everything you should check before buying bathroom tiles at any scale.",
      content:
        "<p>Bathrooms are high-moisture, high-slip zones. Here is what matters when specifying tiles for them.</p><h2>Check water absorption</h2><p>Vitrified tiles absorb under 0.5% water; ceramic tiles absorb more. For floors, prefer vitrified; for walls, premium ceramic is acceptable.</p><h2>Understand slip ratings</h2><p>R9 is walkable, R10 is recommended for wet bathrooms, and R11–R12 suit pool decks. A large tile with a matte finish typically performs better underfoot than glossy.</p><h2>Size matters</h2><p>600×600 mm keeps grout lines low and looks cleaner. Large-format 800×1600 slabs create a seamless, spa-like look but need precise leveling systems.</p><h2>For commercial projects</h2><p>Specify rectified edges and match batch numbers at the site. Ask your Shiv Aadi representative for our bathroom project rate sheet.</p>",
      featuredImage: PRODUCT_IMAGES.luxuryBath,
    },
    {
      title: "Large Format Tiles: Why 800x1600 is Redefining Indian Homes",
      slug: "large-format-tiles-guide",
      excerpt:
        "Fewer joints, grander rooms. How large-format vitrified tiles are changing residential and commercial design across India.",
      content:
        "<p>Indian homes are getting bigger, and so are their tiles.</p><h2>Why large format</h2><p>An 800×1600 mm tile covers the same area as four 400×800 tiles — with one quarter of the grout lines. Visually, the surface reads as a single, continuous slab of stone.</p><h2>Where they shine</h2><p>Living rooms, lobbies, showrooms and retail floors benefit most. The scale of the pattern is designed for large uninterrupted views.</p><h2>Installation notes</h2><p>Large tiles demand a perfectly level substrate, good adhesive coverage and a leveling kit. Budget accordingly — installation skill matters more than the tile price.</p><p>Shiv Aadi stocks a wide range of 800×1600 and 1200×1800 formats with full batch matching for bulk buyers.</p>",
      featuredImage: PRODUCT_IMAGES.hero2,
    },
    {
      title: "Commercial Flooring Guide: Specifying for Hotels, Offices & Retail",
      slug: "commercial-flooring-specification-guide",
      excerpt:
        "Foot traffic, abrasion resistance, slip safety and supply reliability — how to specify flooring for commercial projects.",
      content:
        "<p>Commercial flooring fails when specified with residential assumptions. Here is our specification framework.</p><h2>Traffic classes</h2><p>Glaze quality is rated on a scale (II to V). Hotels, malls and airports need class IV–V glazes. Check the abrasion class, not just the design.</p><h2>Slip resistance</h2><p>Entry zones, washrooms and food zones need R10+ ratings — even if the design team prefers glossy stone.</p><h2>Supply reliability</h2><p>A 200,000 sq.ft project cannot stop because one batch is out of stock. Buy from a house that holds yard stock and can commit to truckload dispatch schedules.</p><p>Shiv Aadi supplies tiles and stone for hospitality and commercial projects across Bihar & Jharkhand with dedicated project pricing.</p>",
      featuredImage: PRODUCT_IMAGES.hero1,
    },
    {
      title: "Interior Design Trends: Marble, Terrazzo, and Warm Neutrals",
      slug: "interior-design-trends-2026",
      excerpt:
        "The surfaces defining 2026 — book-matched marble, terrazzo revival, wood-look planks and warm neutral palettes.",
      content:
        "<p>Here is how leading Indian designers are specifying surfaces this year.</p><h2>Book-matched marble</h2><p>Mirror-image veining on feature walls is the single biggest 'wow' element in luxury projects. It asks for large slabs and patient installation.</p><h2>Terrazzo's revival</h2><p>Terrazzo-effect porcelain brings the 70s classic back — now in tiles that are far more durable than poured terrazzo.</p><h2>Wood without the worry</h2><p>Wood-look planks with deep grain prints are the practical answer to the Instagram oak floor.</p><h2>Warm neutrals</h2><p>Beige, taupe, cream and soft greys dominate — rooms that feel like warm stone rather than cold concrete.</p>",
      featuredImage: PRODUCT_IMAGES.interior1,
    },
  ];
  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: { ...post, published: true, publishedAt: new Date() },
      create: {
        ...post,
        published: true,
        publishedAt: new Date(),
        seoTitle: `${post.title} – Shiv Aadi Blog`,
        seoDescription: post.excerpt,
      },
    });
  }
  console.log(`  ✓ ${posts.length} blog posts`);

  // ---------- Projects ----------
  type ProjectSeed = {
    name: string;
    slug: string;
    location: string;
    type: "RESIDENTIAL" | "COMMERCIAL" | "HOTEL" | "OFFICE" | "RETAIL" | "OTHER";
    description: string;
    images: string[];
    productsUsed: string[];
  };
  const projects: ProjectSeed[] = [
    {
      name: "River Side Residency, Darbhanga",
      slug: "river-side-residency-darbhanga",
      location: "Darbhanga, Bihar",
      type: "RESIDENTIAL",
      description:
        "A 120-unit residential complex. Supplied 85,000 sq.ft of vitrified floor tiles, granite staircases and 480 bathroom tile sets with full batch matching.",
      images: [PRODUCT_IMAGES.project1, PRODUCT_IMAGES.hero2, PRODUCT_IMAGES.floorTile],
      productsUsed: ["Large Format Floor Tile", "Luxury Bathroom Tile"],
    },
    {
      name: "Grand Mithila Hotel",
      slug: "grand-mithila-hotel",
      location: "Patna, Bihar",
      type: "HOTEL",
      description:
        "A 4-star boutique hotel lobby and 60 guest bathrooms finished in book-matched Italian marble and designer wall tiles.",
      images: [PRODUCT_IMAGES.hero3, PRODUCT_IMAGES.luxuryBath, PRODUCT_IMAGES.italianMarble],
      productsUsed: ["Italian Marble – Calacatta", "Designer Wall Tile"],
    },
    {
      name: "Verma Corporate Towers",
      slug: "verma-corporate-towers",
      location: "Muzaffarpur, Bihar",
      type: "OFFICE",
      description:
        "10 floors of commercial office space. Polished black granite for reception areas and high-traffic corridors, acoustically-minded wall tiles for meeting rooms.",
      images: [PRODUCT_IMAGES.blackGranite, PRODUCT_IMAGES.hero1],
      productsUsed: ["Royal Black Granite", "Premium White Marble"],
    },
  ];
  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: { ...project, published: true },
      create: { ...project, published: true },
    });
  }
  console.log(`  ✓ ${projects.length} projects`);

  // ---------- Gallery ----------
  const gallery = [
    { title: "Marble Showroom Floor", url: PRODUCT_IMAGES.whiteMarble, category: "Marble" },
    { title: "Bathroom Design", url: PRODUCT_IMAGES.luxuryBath, category: "Bathroom" },
    { title: "Kitchen Project", url: PRODUCT_IMAGES.kitchenTile, category: "Kitchen" },
    { title: "Living Room", url: PRODUCT_IMAGES.interior1, category: "Residential" },
    { title: "Bedroom Design", url: PRODUCT_IMAGES.interior2, category: "Residential" },
    { title: "Outdoor Installation", url: PRODUCT_IMAGES.outdoorTile, category: "Outdoor" },
    { title: "Hotel Lobby", url: PRODUCT_IMAGES.hero3, category: "Commercial" },
    { title: "Commercial Flooring", url: PRODUCT_IMAGES.floorTile, category: "Commercial" },
  ];
  for (const [i, g] of gallery.entries()) {
    await prisma.galleryImage.upsert({
      where: { id: `seed-g-${i}` },
      update: { ...g, sortOrder: i },
      create: { id: `seed-g-${i}`, ...g, sortOrder: i, published: true },
    });
  }
  console.log(`  ✓ ${gallery.length} gallery images`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
