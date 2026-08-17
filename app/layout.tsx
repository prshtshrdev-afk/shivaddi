import type { Metadata } from "next";
import { Cinzel, Poppins } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
  ),
  icons: {
    icon: "/shivadii-favicon.webp",
    shortcut: "/shivadii-favicon.webp",
    apple: "/shivadii-favicon.webp",
  },
  title: {
    default:
      "Shiv Aadi | Mithila Tiles & Marbles House – Premium Tiles, Marble, Granite & Sanitaryware",
    template: "%s – Shiv Aadi | Mithila Tiles & Marbles House",
  },
  description:
    "Premium tiles, marble, granite and sanitaryware in Madhubani, Bihar. B2B wholesale pricing for builders, architects and dealers. Visit our showroom or request a quote.",
  keywords: [
    "tiles",
    "marble",
    "granite",
    "sanitaryware",
    "Bihar",
    "Madhubani",
    "Benipatti",
    "Mithila",
    "B2B tiles",
    "tile dealer",
    "marble supplier",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Shiv Aadi – Mithila Tiles & Marbles House",
    title:
      "Shiv Aadi | Mithila Tiles & Marbles House – Premium Tiles, Marble, Granite & Sanitaryware",
    description:
      "Premium tiles, marble, granite and sanitaryware in Madhubani, Bihar. B2B wholesale pricing for builders, architects and dealers.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}