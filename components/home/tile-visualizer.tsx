"use client";

/* eslint-disable @next/next/no-img-element -- plain <img> is required here so users can preview uploaded room photos (blob/data URLs), which next/image does not support. */

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  Camera,
  Check,
  ChevronRight,
  Eye,
  Image as ImageIcon,
  MessageCircle,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SectionHeading from "./section-heading";

export type VisualizerProduct = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
};

const ROOMS = [
  {
    name: "Living Room",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Bathroom",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Kitchen",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Bedroom",
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1400&auto=format&fit=crop",
  },
  {
    name: "Exterior",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400&auto=format&fit=crop",
  },
];

const BLENDS = ["multiply", "overlay", "soft-light", "screen", "normal"] as const;

const STEPS = [
  { label: "Click a pic of your room", icon: Camera },
  { label: "Try different tile designs", icon: Check },
];

export default function TileVisualizer({
  products,
  whatsappLink = "",
}: {
  products: VisualizerProduct[];
  whatsappLink?: string;
}) {
  const [room, setRoom] = useState(ROOMS[0]);
  const [uploadedRoom, setUploadedRoom] = useState<string | null>(null);
  const [tile, setTile] = useState<VisualizerProduct | null>(null);
  const [opacity, setOpacity] = useState(55);
  const [blend, setBlend] = useState<(typeof BLENDS)[number]>("multiply");
  const [step, setStep] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);

  const roomImage = uploadedRoom ?? room.image;

  const onUpload = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedRoom(String(reader.result));
      setStep(1);
    };
    reader.readAsDataURL(file);
  };

  const visibleProducts = useMemo(() => products.slice(0, 24), [products]);

  const nextStep = () => setStep((s) => Math.min(s + 1, 1));

  return (
    <section id="try-in-your-room" className="scroll-mt-32 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          kicker="Tria-Arrange · Try Before You Buy"
          title="Try Before You Buy In 2 Simple Steps"
          description="Click a pic of your room, then try different tile designs — or upload a photo of your own room and preview it right there."
          align="center"
        />

        {/* Steps */}
        <div className="mx-auto mb-12 flex max-w-2xl items-center justify-center">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="flex items-center">
                <button
                  type="button"
                  onClick={() => setStep(i)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] transition-all duration-300 sm:px-5",
                    step === i
                      ? "border-gold bg-gold text-charcoal shadow-gold"
                      : "border-charcoal/15 bg-white text-stone hover:border-gold/50",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
                {i < STEPS.length - 1 && (
                  <ChevronRight
                    className={cn(
                      "mx-1 h-4 w-4 sm:mx-2",
                      step > i ? "text-gold-dark" : "text-charcoal/25",
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[420px_1fr]">
          {/* Controls */}
          <div className="space-y-6">
            {/* Step 1 – room */}
            <div className={cn("border p-5", step === 0 ? "border-gold/60" : "border-charcoal/10")}>
              <p className="mb-4 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-charcoal">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] text-charcoal">
                  1
                </span>
                Click a Pic of Your Room
              </p>
              <div className="grid grid-cols-5 gap-2">
                {ROOMS.map((r) => (
                  <button
                    key={r.name}
                    type="button"
                    onClick={() => {
                      setRoom(r);
                      setUploadedRoom(null);
                      nextStep();
                    }}
                    className={cn(
                      "group relative aspect-[3/4] overflow-hidden rounded-md border-2 transition-all duration-300",
                      roomImage === r.image && !uploadedRoom
                        ? "border-gold"
                        : "border-transparent hover:border-gold/50",
                    )}
                    title={r.name}
                  >
                    <img
                      src={r.image}
                      alt={r.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-charcoal/70 py-0.5 text-center text-[9px] font-medium uppercase tracking-wide text-white">
                      {r.name}
                    </span>
                  </button>
                ))}
              </div>
              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-charcoal/25 py-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-charcoal/70 transition-all duration-300 hover:border-gold hover:bg-brand-yellow-soft hover:text-charcoal">
                <Upload className="h-4 w-4" />
                Upload Your Room Photo
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onUpload(e.target.files?.[0])}
                />
              </label>
            </div>

            {/* Step 2 – tile */}
            <div className={cn("border p-5", step === 1 ? "border-gold/60" : "border-charcoal/10")}>
              <p className="mb-4 inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-charcoal">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[11px] text-charcoal">
                  2
                </span>
                Try Different Tile Designs
              </p>
              {visibleProducts.length ? (
                <div className="grid max-h-64 grid-cols-6 gap-2 overflow-y-auto pr-1">
                  {visibleProducts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setTile(p);
                        nextStep();
                      }}
                      className={cn(
                        "group relative aspect-square overflow-hidden rounded-md border-2 bg-beige transition-all duration-300",
                        tile?.id === p.id
                          ? "border-gold"
                          : "border-transparent hover:border-gold/50",
                      )}
                      title={p.name}
                    >
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-[9px] text-stone">
                          No image
                        </span>
                      )}
                      {tile?.id === p.id && (
                        <span className="absolute inset-0 flex items-center justify-center bg-gold/25">
                          <Check className="h-5 w-5 text-charcoal" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="py-4 text-sm text-stone">
                  Add products to the catalogue to unlock the visualizer.
                </p>
              )}
              {tile && (
                <p className="mt-3 truncate text-[12px] font-medium text-charcoal">
                  Selected: {tile.name}
                </p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-charcoal/10 pt-4">
                {tile ? (
                  <Link href={`/b2b-quote?product=${tile.slug}`} className="btn-gold !px-6 !py-2.5">
                    Get This Look
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-charcoal/5 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-stone">
                    <ImageIcon className="h-4 w-4" /> Pick a tile first
                  </span>
                )}
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-dark !px-6 !py-2.5"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Ask an Expert
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-charcoal/10 bg-charcoal shadow-2xl">
              <img
                src={roomImage}
                alt={tile ? `Previewing ${tile.name}` : "Room preview"}
                className="absolute inset-0 h-full w-full object-cover"
              />
              {tile?.image && (
                <img
                  src={tile.image}
                  alt={tile.name}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{
                    mixBlendMode: blend,
                    opacity: opacity / 100,
                  }}
                />
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-charcoal/85 to-transparent px-5 py-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                    {tile ? roomImage === uploadedRoom ? "Your room ·" : `${room.name} ·` : "Preview"}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {tile ? tile.name : "Select a tile to preview it here"}
                  </p>
                </div>
                <span className="rounded-full border border-gold/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                  {blend} · {opacity}%
                </span>
              </div>
              {!tile && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-charcoal/70 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-gold backdrop-blur">
                    <Eye className="h-4 w-4" />
                    Your preview appears here
                  </span>
                </div>
              )}
            </div>

            {/* Style controls */}
            <div className="mt-5 -mx-4 flex flex-col gap-4 rounded-xl border border-charcoal/10 bg-white p-5 shadow-card sm:mx-0 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Finish
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {BLENDS.map((b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => setBlend(b)}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-[11px] capitalize transition-all duration-300",
                        blend === b
                          ? "border-gold bg-gold font-semibold text-charcoal"
                          : "border-charcoal/15 text-charcoal/70 hover:border-gold/60",
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
              <div className="min-w-48">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-stone">
                  Intensity · {opacity}%
                </p>
                <input
                  type="range"
                  min={10}
                  max={80}
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-gold"
                />
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] uppercase tracking-[0.14em] text-stone">
              Blend modes simulate how the surface reads on a real wall
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}