import { MessageCircle } from "lucide-react";
import { getContactInfo } from "@/lib/site";

export default async function WhatsAppFloat() {
  const { whatsapp } = await getContactInfo();
  const clean = whatsapp.replace(/[^0-9]/g, "");
  if (!clean) return null;

  const href = `https://wa.me/${clean}?text=${encodeURIComponent(
    "Hello Shiv Aadi! I'd like to enquire about tiles & marble.",
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgb(0_0_0/0.3)] transition-transform duration-300 hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-[2px] bg-charcoal px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}