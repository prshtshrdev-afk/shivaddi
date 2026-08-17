# Shiv Aadi – Mithila Tiles & Marbles House

Premium tiles, marble, granite and sanitaryware showroom website for Darbhanga, Bihar. Built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **Prisma ORM 7** and **PostgreSQL**.

## Getting Started

```bash
npm install
npm run db:deploy  # apply prisma migrations to Neon (serverless Postgres)
npm run db:seed    # seed categories, products, admin user, content
npm run dev
```

The database is **Neon** (serverless Postgres, online). Set `DATABASE_URL` in `.env`
to your Neon connection string (see `.env.example`). No local Docker/Postgres needed.

Useful commands:

| Command               | Purpose                              |
| --------------------- | ------------------------------------ |
| `npm run db:deploy`   | Apply migrations (`prisma migrate deploy`) |
| `npm run db:seed`     | Seed catalog + demo content          |
| `npm run db:import`   | Import the full Orientbell catalog into the DB |
| `npm run lint`        | ESLint check                         |
| `npm run typecheck`   | `tsc --noEmit`                       |
| `npm run build`       | Production build                     |

## Environment Variables

Create `.env` from `.env.example`:

- `DATABASE_URL` – Postgres connection string
- `AUTH_SECRET` – NextAuth secret (generate with `npx auth secret`)
- `NEXT_PUBLIC_SITE_URL` – public site URL (used for sitemap/robots)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` – fallback WhatsApp number (country code, digits only)
- `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASSWORD` / `B2B_INQUIRY_EMAIL` – optional; enables email notifications for B2B leads and contact form messages (gracefully skipped when unset)

## Features

### Public site (/)
- Homepage with hero slider, category navigation, featured product carousel, design ideas marquee, why-us, testimonials, gallery strip and blog strip
- Product catalog with filters (search, category, price type, sort)
- Product detail pages with gallery, specs, related products
- Category tree with subcategories
- Projects portfolio, Gallery with lightbox, Blog
- Contact page and **B2B quote** form (honeypot + IP rate limiting + zod validation)
- WhatsApp floating button
- SEO: per-page metadata, JSON-LD LocalBusiness schema, `sitemap.xml`, `robots.txt`

### Admin (/admin)
Protected with NextAuth (Credentials) via the Next.js 16 **proxy** (`proxy.ts`) + server-side checks.

- Login at `/admin-login`
- Dashboard with stats and recent leads
- Products, Categories, Blog, Projects, Gallery CRUD with publish toggles
- Leads inbox with status workflow (New → Contacted → Qualified → Converted → Closed)
- Settings editor (contact info, socials, homepage hero/about/why-us/stats content)

Seed admin credentials: `admin@shivaadi.in` / `change-me-now` (change after first login).

## Project Structure

```
app/
  (site)/          # public routes (marketing pages, products, blog…)
  admin/           # admin panel (server-guarded layout + shell)
  admin-login/     # admin sign-in page
  api/auth/        # NextAuth route handler
  generated/prisma # Prisma 7 generated client
components/
  site/            # header, footer, whatsapp float, reveal, social icons
  home/            # homepage sections
  products/        # cards, gallery, grid, serialization
  forms/           # lead + contact forms
  admin/           # admin shell, tables, forms
  gallery/
lib/
  site.ts          # server-only settings/contact helpers
  email.ts         # SMTP notifications (optional)
  rate-limit.ts    # in-memory IP rate limiting
  actions/         # server actions (leads, contact, admin CRUD)
  constants.ts     # shared client-safe enums
  validation/      # zod schemas
prisma/
  schema.prisma    # data model
  seed.ts          # typed seed data
proxy.ts           # Next.js 16 proxy (was middleware) – admin auth + matcher
```