import { prisma } from "@/lib/prisma";
import { getContactInfo } from "@/lib/site";
import SiteHeader from "./site-header";

export default async function Header() {
  const categories = await prisma.category.findMany({
    where: { published: true, parentId: null },
    orderBy: { displayOrder: "asc" },
    include: {
      children: {
        where: { published: true },
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  const contact = await getContactInfo();

  return <SiteHeader categories={categories} contact={contact} />;
}