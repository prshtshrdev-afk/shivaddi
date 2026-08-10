import { redirect } from "next/navigation";
import { auth } from "@/auth";
import AdminShell from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/admin-login");
  return <AdminShell user={session.user}>{children}</AdminShell>;
}