"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveSettings, savePageContent } from "@/lib/actions/admin";
import { cn } from "@/lib/utils";

const inputCls =
  "w-full border border-stone-300 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-stone/60 focus:border-gold focus:outline-none transition-colors";
const labelCls =
  "mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/75";
const sectionCls = "border border-stone-200 bg-white p-6";

export default function SettingsForm({
  settings,
  homeHero,
  homeAbout,
  whyUs,
  stats,
}: {
  settings: Record<string, string>;
  homeHero: Record<string, string>;
  homeAbout: Record<string, string>;
  whyUs: Record<string, string>;
  stats: Record<string, string>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("general");

  const TABS = [
    { id: "general", label: "Company" },
    { id: "contact", label: "Contact" },
    { id: "hero", label: "Home Hero" },
    { id: "about", label: "Home About" },
    { id: "whyus", label: "Why Us" },
    { id: "stats", label: "Stats" },
  ] as const;

  function field(name: string, value: string, type: "input" | "textarea" | "long" = "input") {
    if (type === "long")
      return <textarea name={name} defaultValue={value} rows={10} className={inputCls} />;
    if (type === "textarea")
      return <textarea name={name} defaultValue={value} rows={4} className={inputCls} />;
    return <input name={name} defaultValue={value} className={inputCls} />;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    const fd = new FormData(e.currentTarget);
    const collect = (names: string[]) =>
      Object.fromEntries(names.map((n) => [n, String(fd.get(n) ?? "")]));

    const settingKeys = [
      "companyName", "companyTagline", "companyLegalName", "gstin", "phone",
      "phoneDisplay", "whatsapp", "email", "b2bEmail", "address", "addressShort",
      "mapsUrl", "hours", "instagram", "facebook", "youtube",
    ];

    startTransition(async () => {
      const r1 = await saveSettings("general", collect(settingKeys));
      const r2 = await savePageContent("home", "hero", collect(["kicker", "title", "description"]));
      const r3 = await savePageContent("home", "about", collect(["heading", "content", "image"]));
      const r4 = await savePageContent("why-us", "section", collect(["heading", "subheading", "content"]));
      const r5 = await savePageContent("home", "stats", collect(["stat1", "stat2", "stat3", "stat4"]));
      if (r1.ok && r2.ok && r3.ok && r4.ok && r5.ok) {
        setSaved(true);
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-4xl space-y-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "border px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors",
              tab === t.id
                ? "border-gold bg-gold text-charcoal"
                : "border-stone-300 bg-white text-stone hover:border-gold/60 hover:text-gold-dark",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div id={`tab-${tab}`}>
        {tab === "general" && (
          <div className={sectionCls}>
            <h2 className="font-serif text-base font-bold text-charcoal">Company</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Company name</label>
                {field("companyName", settings["companyName"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>Legal name</label>
                {field("companyLegalName", settings["companyLegalName"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>GSTIN</label>
                {field("gstin", settings["gstin"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>Tagline</label>
                {field("companyTagline", settings["companyTagline"] ?? "")}
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Address</label>
                {field("address", settings["address"] ?? "", "textarea")}
              </div>
              <div>
                <label className={labelCls}>Short address (footer)</label>
                {field("addressShort", settings["addressShort"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>Google Maps link</label>
                {field("mapsUrl", settings["mapsUrl"] ?? "")}
              </div>
            </div>
          </div>
        )}

        {tab === "contact" && (
          <div className={sectionCls}>
            <h2 className="font-serif text-base font-bold text-charcoal">Contact details</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Phone (raw digits)</label>
                {field("phone", settings["phone"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>Phone (display format)</label>
                {field("phoneDisplay", settings["phoneDisplay"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>WhatsApp number (with country code)</label>
                {field("whatsapp", settings["whatsapp"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>Email</label>
                {field("email", settings["email"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>B2B email</label>
                {field("b2bEmail", settings["b2bEmail"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>Opening hours</label>
                {field("hours", settings["hours"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>Instagram</label>
                {field("instagram", settings["instagram"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>Facebook</label>
                {field("facebook", settings["facebook"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>YouTube</label>
                {field("youtube", settings["youtube"] ?? "")}
              </div>
            </div>
          </div>
        )}

        {tab === "hero" && (
          <div className={sectionCls}>
            <h2 className="font-serif text-base font-bold text-charcoal">Homepage hero</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label className={labelCls}>Kicker</label>
                {field("kicker", homeHero["kicker"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>Title</label>
                {field("title", homeHero["title"] ?? "", "textarea")}
              </div>
              <div>
                <label className={labelCls}>Description</label>
                {field("description", homeHero["description"] ?? "", "textarea")}
              </div>
            </div>
          </div>
        )}

        {tab === "about" && (
          <div className={sectionCls}>
            <h2 className="font-serif text-base font-bold text-charcoal">Homepage about preview</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label className={labelCls}>Heading</label>
                {field("heading", homeAbout["heading"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>Content</label>
                {field("content", homeAbout["content"] ?? "", "long")}
              </div>
              <div>
                <label className={labelCls}>Image URL</label>
                {field("image", homeAbout["image"] ?? "")}
              </div>
            </div>
          </div>
        )}

        {tab === "whyus" && (
          <div className={sectionCls}>
            <h2 className="font-serif text-base font-bold text-charcoal">Why choose us</h2>
            <div className="mt-5 space-y-5">
              <div>
                <label className={labelCls}>Heading</label>
                {field("heading", whyUs["heading"] ?? "")}
              </div>
              <div>
                <label className={labelCls}>Subheading</label>
                {field("subheading", whyUs["subheading"] ?? "", "textarea")}
              </div>
              <div>
                <label className={labelCls}>Content (JSON: icon, title, text)</label>
                {field("content", whyUs["content"] ?? "", "long")}
              </div>
              <p className="text-[12px] text-stone">
                Format: one JSON array, e.g.{" "}
                <code className="bg-stone-100 px-1">
                  {`[{"icon":"BadgeCheck","title":"…","text":"…"}]`}
                </code>
              </p>
            </div>
          </div>
        )}

        {tab === "stats" && (
          <div className={sectionCls}>
            <h2 className="font-serif text-base font-bold text-charcoal">Stats strip</h2>
            <p className="mt-1 text-[12px] text-stone">
              Each stat as JSON: value and label.
            </p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n}>
                  <label className={labelCls}>Stat {n}</label>
                  {field(`stat${n}`, stats[`stat${n}`] ?? "", "long")}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn-gold">
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save All Settings
        </button>
        {saved && <p className="text-[13px] font-semibold text-green-700">Saved.</p>}
      </div>
    </form>
  );
}