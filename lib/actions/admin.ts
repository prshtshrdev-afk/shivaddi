"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  productFormSchema,
  categoryFormSchema,
  blogFormSchema,
  projectFormSchema,
  galleryFormSchema,
  type ProductFormValues,
} from "@/lib/validation/schemas";
import { formatSlug } from "@/lib/utils";

type Result = { ok: boolean; message: string };

function fail(error: unknown): Result {
  console.error("[admin] Action failed:", error);
  return { ok: false, message: "Something went wrong. Please try again." };
}

/* --------------------------------- Products -------------------------------- */

export async function createProduct(
  input: ProductFormValues,
): Promise<Result> {
  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  try {
    const product = await prisma.product.create({
      data: {
        name: d.name,
        slug: d.slug || formatSlug(d.name),
        sku: d.sku || null,
        categoryId: d.categoryId || null,
        subcategory: d.subcategory || null,
        shortDescription: d.shortDescription || null,
        description: d.description || null,
        material: d.material || null,
        size: d.size || null,
        thickness: d.thickness || null,
        finish: d.finish || null,
        colour: d.colour || null,
        application: d.application || null,
        stockStatus: d.stockStatus,
        priceType: d.priceType,
        price: d.price ?? null,
        moq: d.moq || null,
        featured: d.featured,
        isNew: d.isNew,
        tags: d.tags ? d.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        published: d.published,
        seoTitle: d.seoTitle || null,
        seoDescription: d.seoDescription || null,
        images: {
          create: (d.images ?? []).map((img, i) => ({
            url: img.url,
            alt: img.alt || null,
            sortOrder: i,
            isThumbnail: i === 0,
          })),
        },
      },
    });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/admin/products");
    return { ok: true, message: "Product created." };
  } catch (e) {
    return fail(e);
  }
}

export async function updateProduct(
  id: string,
  input: ProductFormValues,
): Promise<Result> {
  const parsed = productFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  try {
    const existing = await prisma.product.findUnique({
      where: { id },
      select: { slug: true },
    });
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: d.name,
        slug: d.slug || formatSlug(d.name),
        sku: d.sku || null,
        categoryId: d.categoryId || null,
        subcategory: d.subcategory || null,
        shortDescription: d.shortDescription || null,
        description: d.description || null,
        material: d.material || null,
        size: d.size || null,
        thickness: d.thickness || null,
        finish: d.finish || null,
        colour: d.colour || null,
        application: d.application || null,
        stockStatus: d.stockStatus,
        priceType: d.priceType,
        price: d.price ?? null,
        moq: d.moq || null,
        featured: d.featured,
        isNew: d.isNew,
        tags: d.tags ? d.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        published: d.published,
        seoTitle: d.seoTitle || null,
        seoDescription: d.seoDescription || null,
        images: {
          deleteMany: {},
          create: (d.images ?? []).map((img, i) => ({
            url: img.url,
            alt: img.alt || null,
            sortOrder: i,
            isThumbnail: i === 0,
          })),
        },
      },
    });
    revalidatePath("/");
    revalidatePath("/products");
    if (existing?.slug) revalidatePath(`/products/${existing.slug}`);
    revalidatePath(`/products/${product.slug}`);
    revalidatePath("/admin/products");
    return { ok: true, message: "Product updated." };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteProduct(id: string): Promise<Result> {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath("/admin/products");
    return { ok: true, message: "Product deleted." };
  } catch (e) {
    return fail(e);
  }
}

export async function toggleProductPublished(
  id: string,
  published: boolean,
): Promise<Result> {
  try {
    const p = await prisma.product.update({ where: { id }, data: { published } });
    revalidatePath("/");
    revalidatePath("/products");
    revalidatePath(`/products/${p.slug}`);
    revalidatePath("/admin/products");
    return { ok: true, message: published ? "Product published." : "Product hidden." };
  } catch (e) {
    return fail(e);
  }
}

/* -------------------------------- Categories ------------------------------- */

export async function createCategory(
  input: z.infer<typeof categoryFormSchema>,
): Promise<Result> {
  const parsed = categoryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  try {
    await prisma.category.create({
      data: {
        name: d.name,
        slug: d.slug || formatSlug(d.name),
        description: d.description || null,
        image: d.image || null,
        parentId: d.parentId || null,
        displayOrder: d.displayOrder,
        published: d.published,
      },
    });
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/admin/categories");
    return { ok: true, message: "Category created." };
  } catch (e) {
    return fail(e);
  }
}

export async function updateCategory(
  id: string,
  input: z.infer<typeof categoryFormSchema>,
): Promise<Result> {
  const parsed = categoryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  try {
    await prisma.category.update({
      where: { id },
      data: {
        name: d.name,
        slug: d.slug || formatSlug(d.name),
        description: d.description || null,
        image: d.image || null,
        parentId: d.parentId || null,
        displayOrder: d.displayOrder,
        published: d.published,
      },
    });
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/admin/categories");
    return { ok: true, message: "Category updated." };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteCategory(id: string): Promise<Result> {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/categories");
    revalidatePath("/admin/categories");
    return { ok: true, message: "Category deleted." };
  } catch (e) {
    return fail(e);
  }
}

/* ----------------------------------- Leads ---------------------------------- */

export async function updateLeadStatus(
  id: string,
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "CLOSED",
): Promise<Result> {
  try {
    await prisma.lead.update({ where: { id }, data: { status } });
    revalidatePath("/admin/leads");
    return { ok: true, message: "Lead updated." };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteLead(id: string): Promise<Result> {
  try {
    await prisma.lead.delete({ where: { id } });
    revalidatePath("/admin/leads");
    return { ok: true, message: "Lead deleted." };
  } catch (e) {
    return fail(e);
  }
}

/* ----------------------------------- Blog ----------------------------------- */

export async function createBlogPost(
  input: z.infer<typeof blogFormSchema>,
): Promise<Result> {
  const parsed = blogFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  try {
    await prisma.blogPost.create({
      data: {
        title: d.title,
        slug: d.slug || formatSlug(d.title),
        excerpt: d.excerpt || null,
        content: d.content,
        featuredImage: d.featuredImage || null,
        published: d.published,
        publishedAt: d.published ? new Date() : null,
        seoTitle: d.seoTitle || null,
        seoDescription: d.seoDescription || null,
      },
    });
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { ok: true, message: "Post created." };
  } catch (e) {
    return fail(e);
  }
}

export async function updateBlogPost(
  id: string,
  input: z.infer<typeof blogFormSchema>,
): Promise<Result> {
  const parsed = blogFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  try {
    const existing = await prisma.blogPost.findUnique({ where: { id } });
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: d.title,
        slug: d.slug || formatSlug(d.title),
        excerpt: d.excerpt || null,
        content: d.content,
        featuredImage: d.featuredImage || null,
        published: d.published,
        publishedAt:
          d.published && !existing?.published ? new Date() : existing?.publishedAt ?? (d.published ? new Date() : null),
        seoTitle: d.seoTitle || null,
        seoDescription: d.seoDescription || null,
      },
    });
    revalidatePath("/");
    revalidatePath("/blog");
    if (existing?.slug) revalidatePath(`/blog/${existing.slug}`);
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");
    return { ok: true, message: "Post updated." };
  } catch (e) {
    return fail(e);
  }
}

export async function toggleBlogPostPublished(id: string): Promise<Result> {
  try {
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) return { ok: false, message: "Post not found." };
    const published = !post.published;
    await prisma.blogPost.update({
      where: { id },
      data: {
        published,
        publishedAt: published ? (post.publishedAt ?? new Date()) : null,
      },
    });
    revalidatePath("/");
    revalidatePath("/blog");
    if (post.slug) revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");
    return { ok: true, message: published ? "Post published." : "Post hidden." };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteBlogPost(id: string): Promise<Result> {
  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { ok: true, message: "Post deleted." };
  } catch (e) {
    return fail(e);
  }
}

/* --------------------------------- Projects -------------------------------- */

export async function createProject(
  input: z.infer<typeof projectFormSchema>,
): Promise<Result> {
  const parsed = projectFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  try {
    await prisma.project.create({
      data: {
        name: d.name,
        slug: d.slug || formatSlug(d.name),
        location: d.location || null,
        type: d.type,
        description: d.description || null,
        images: d.images ?? [],
        productsUsed: d.productsUsed
          ? d.productsUsed.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        published: d.published,
      },
    });
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { ok: true, message: "Project created." };
  } catch (e) {
    return fail(e);
  }
}

export async function updateProject(
  id: string,
  input: z.infer<typeof projectFormSchema>,
): Promise<Result> {
  const parsed = projectFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    const project = await prisma.project.update({
      where: { id },
      data: {
        name: d.name,
        slug: d.slug || formatSlug(d.name),
        location: d.location || null,
        type: d.type,
        description: d.description || null,
        images: d.images ?? [],
        productsUsed: d.productsUsed
          ? d.productsUsed.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        published: d.published,
      },
    });
    revalidatePath("/projects");
    if (existing?.slug) revalidatePath(`/projects/${existing.slug}`);
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");
    return { ok: true, message: "Project updated." };
  } catch (e) {
    return fail(e);
  }
}

export async function toggleProjectPublished(id: string): Promise<Result> {
  try {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) return { ok: false, message: "Project not found." };
    const published = !project.published;
    await prisma.project.update({ where: { id }, data: { published } });
    revalidatePath("/projects");
    revalidatePath(`/projects/${project.slug}`);
    revalidatePath("/admin/projects");
    return { ok: true, message: published ? "Project published." : "Project hidden." };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteProject(id: string): Promise<Result> {
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath("/projects");
    revalidatePath("/admin/projects");
    return { ok: true, message: "Project deleted." };
  } catch (e) {
    return fail(e);
  }
}

/* ---------------------------------- Gallery --------------------------------- */

export async function createGalleryImage(
  input: z.infer<typeof galleryFormSchema>,
): Promise<Result> {
  const parsed = galleryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  try {
    await prisma.galleryImage.create({
      data: { title: d.title || null, url: d.url, category: d.category || null, published: d.published },
    });
    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { ok: true, message: "Image added." };
  } catch (e) {
    return fail(e);
  }
}

export async function updateGalleryImage(
  id: string,
  input: z.infer<typeof galleryFormSchema>,
): Promise<Result> {
  const parsed = galleryFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const d = parsed.data;
  try {
    await prisma.galleryImage.update({
      where: { id },
      data: { title: d.title || null, url: d.url, category: d.category || null, published: d.published },
    });
    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { ok: true, message: "Image updated." };
  } catch (e) {
    return fail(e);
  }
}

export async function toggleGalleryImagePublished(id: string): Promise<Result> {
  try {
    const img = await prisma.galleryImage.findUnique({ where: { id } });
    if (!img) return { ok: false, message: "Image not found." };
    const published = !img.published;
    await prisma.galleryImage.update({ where: { id }, data: { published } });
    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { ok: true, message: published ? "Image shown." : "Image hidden." };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteGalleryImage(id: string): Promise<Result> {
  try {
    await prisma.galleryImage.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/gallery");
    revalidatePath("/admin/gallery");
    return { ok: true, message: "Image deleted." };
  } catch (e) {
    return fail(e);
  }
}

/* --------------------------------- Settings --------------------------------- */

export async function savePageContent(
  page: string,
  section: string,
  values: Record<string, string>,
): Promise<Result> {
  try {
    await prisma.$transaction(
      Object.entries(values).map(([key, content]) =>
        prisma.pageContent.upsert({
          where: { page_section_key: { page, section, key } },
          create: { page, section, key, content },
          update: { content },
        }),
      ),
    );
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { ok: true, message: "Content saved." };
  } catch (e) {
    return fail(e);
  }
}

export async function saveSettings(
  group: string,
  values: Record<string, string>,
): Promise<Result> {
  try {
    const keys = Object.keys(values);
    await prisma.$transaction(
      keys.map((key) =>
        prisma.siteSetting.upsert({
          where: { key },
          create: { key, value: values[key], group },
          update: { value: values[key], group },
        }),
      ),
    );
    revalidatePath("/");
    revalidatePath("/");
    revalidatePath("/admin/settings");
    return { ok: true, message: "Settings saved." };
  } catch (e) {
    return fail(e);
  }
}
