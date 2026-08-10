import { z } from "zod";

export const BUSINESS_TYPE_VALUES = [
  "BUILDER",
  "CONTRACTOR",
  "ARCHITECT",
  "INTERIOR_DESIGNER",
  "DEALER",
  "RETAILER",
  "REAL_ESTATE",
  "HOTEL",
  "OTHER",
] as const;

const phoneRegex = /^[+]?[0-9\s\-()]{7,15}$/;

export const leadSchema = z.object({
  name: z
    .string({ error: "Full name is required" })
    .trim()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(120),
  company: z
    .string()
    .trim()
    .max(120, { error: "Company name is too long" })
    .optional()
    .or(z.literal("")),
  email: z.email({ error: "Please enter a valid email address" }).trim(),
  phone: z
    .string({ error: "Phone number is required" })
    .trim()
    .regex(phoneRegex, { error: "Please enter a valid phone number" }),
  city: z
    .string()
    .trim()
    .max(80)
    .optional()
    .or(z.literal("")),
  businessType: z.enum(BUSINESS_TYPE_VALUES, {
    error: "Please select your business type",
  }),
  productId: z.string().trim().optional().or(z.literal("")),
  productName: z.string().trim().max(160).optional().or(z.literal("")),
  quantity: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .max(2000, { error: "Message is too long (max 2000 characters)" })
    .optional()
    .or(z.literal("")),
  projectName: z.string().trim().max(160).optional().or(z.literal("")),
  projectLocation: z.string().trim().max(160).optional().or(z.literal("")),
  expectedDate: z.string().trim().max(80).optional().or(z.literal("")),
  consent: z
    .boolean({ error: "Please agree to be contacted" })
    .refine((v) => v === true, {
      error: "Please agree to be contacted regarding your enquiry",
    }),
  // Honeypot – must stay empty; bots fill it in
  website: z.string().max(0, { error: "Spam detected" }).optional(),
});

export const contactSchema = z.object({
  name: leadSchema.shape.name,
  email: leadSchema.shape.email,
  phone: leadSchema.shape.phone,
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  message: z
    .string({ error: "Message is required" })
    .trim()
    .min(10, { error: "Message must be at least 10 characters" })
    .max(3000),
  website: z.string().max(0).optional(),
});

// Admin
export const adminLoginSchema = z.object({
  email: z.email({ error: "Please enter a valid email" }).trim(),
  password: z.string({ error: "Password is required" }).min(1),
});

export const categoryFormSchema = z.object({
  name: z.string().trim().min(2, { error: "Name is required" }).max(100),
  slug: z
    .string()
    .trim()
    .min(2, { error: "Slug is required" })
    .regex(/^[a-z0-9-]+$/, {
      error: "Slug must contain only lowercase letters, numbers and hyphens",
    }),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  image: z.string().trim().optional().or(z.literal("")),
  parentId: z.string().trim().optional().or(z.literal("")),
  displayOrder: z.coerce.number().int().min(0).max(999).default(0),
  published: z.coerce.boolean().default(true),
});

export const seoFieldsSchema = {
  seoTitle: z.string().trim().max(70).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(180).optional().or(z.literal("")),
};

export const productFormSchema = z.object({
  name: z.string().trim().min(2, { error: "Product name is required" }).max(160),
  slug: z
    .string({ error: "Slug is required" })
    .trim()
    .min(2)
    .regex(/^[a-z0-9-]+$/, {
      error: "Slug must contain only lowercase letters, numbers and hyphens",
    }),
  sku: z.string().trim().max(60).optional().or(z.literal("")),
  categoryId: z.string().trim().optional().or(z.literal("")),
  subcategory: z.string().trim().max(100).optional().or(z.literal("")),
  shortDescription: z.string().trim().max(500).optional().or(z.literal("")),
  description: z.string().trim().max(10000).optional().or(z.literal("")),
  material: z.string().trim().max(100).optional().or(z.literal("")),
  size: z.string().trim().max(60).optional().or(z.literal("")),
  thickness: z.string().trim().max(60).optional().or(z.literal("")),
  finish: z.string().trim().max(80).optional().or(z.literal("")),
  colour: z.string().trim().max(80).optional().or(z.literal("")),
  application: z.string().trim().max(120).optional().or(z.literal("")),
  stockStatus: z.string().trim().max(60).default("In Stock"),
  priceType: z.enum(["EXACT", "FROM", "ON_REQUEST"], {
    error: "Select a price type",
  }),
  price: z.coerce.number().nonnegative().optional().nullable(),
  moq: z.string().trim().max(80).optional().or(z.literal("")),
  featured: z.coerce.boolean().default(false),
  isNew: z.coerce.boolean().default(false),
  tags: z.string().trim().optional().or(z.literal("")), // comma separated
  published: z.coerce.boolean().default(false),
  images: z.array(
    z.object({ url: z.string().trim().min(1), alt: z.string().trim().max(200).optional() }),
  ).max(12).optional(),
  ...seoFieldsSchema,
});

export const blogFormSchema = z.object({
  title: z.string().trim().min(3, { error: "Title is required" }).max(200),
  slug: productFormSchema.shape.slug,
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  content: z
    .string({ error: "Content is required" })
    .trim()
    .min(20, { error: "Content must be at least 20 characters" }),
  featuredImage: z.string().trim().optional().or(z.literal("")),
  published: z.coerce.boolean().default(false),
  ...seoFieldsSchema,
});

export const projectFormSchema = z.object({
  name: z.string().trim().min(2, { error: "Project name is required" }).max(160),
  slug: productFormSchema.shape.slug,
  location: z.string().trim().max(160).optional().or(z.literal("")),
  type: z.enum(["RESIDENTIAL", "COMMERCIAL", "HOTEL", "OFFICE", "RETAIL", "OTHER"], {
    error: "Select a project type",
  }),
  description: z.string().trim().max(10000).optional().or(z.literal("")),
  images: z.array(z.string().trim().min(1)).max(12).optional(),
  productsUsed: z.string().trim().optional().or(z.literal("")),
  published: z.coerce.boolean().default(false),
});

export const galleryFormSchema = z.object({
  title: z.string().trim().max(200).optional().or(z.literal("")),
  url: z.string({ error: "Image URL is required" }).trim().min(1),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  published: z.coerce.boolean().default(true),
});

export const settingFormSchema = z.record(z.string(), z.string());

export type LeadFormValues = z.infer<typeof leadSchema>;
export type ProductFormValues = z.infer<typeof productFormSchema>;