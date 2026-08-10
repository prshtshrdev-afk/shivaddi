import { prisma } from "@/lib/prisma";
import SettingsForm from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settingRows, contentRows] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.pageContent.findMany(),
  ]);

  const settings = Object.fromEntries(settingRows.map((r) => [r.key, r.value]));

  const contentOf = (page: string, section: string) =>
    Object.fromEntries(
      contentRows
        .filter((r) => r.page === page && r.section === section)
        .map((r) => [r.key, r.content]),
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-charcoal">Settings</h1>
        <p className="mt-1 text-[13px] text-stone">
          Edit site-wide information and homepage content.
        </p>
      </div>
      <SettingsForm
        settings={settings}
        homeHero={contentOf("home", "hero")}
        homeAbout={contentOf("home", "about")}
        whyUs={contentOf("why-us", "section")}
        stats={contentOf("home", "stats")}
      />
    </div>
  );
}