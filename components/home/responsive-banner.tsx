"use client";

import Image from "next/image";

interface ResponsiveBannerProps {
  desktopImage: string;
  mobileImage: string;
  alt?: string;
  className?: string;
}

export default function ResponsiveBanner({
  desktopImage,
  mobileImage,
  alt = "Banner",
  className = "",
}: ResponsiveBannerProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopImage} />
        <source media="(max-width: 767px)" srcSet={mobileImage} />
        <Image
          src={mobileImage}
          alt={alt}
          fill
          sizes="(max-width: 767px) 100vw, 100vw"
          className="object-cover w-full h-full"
          priority
        />
      </picture>
    </div>
  );
}