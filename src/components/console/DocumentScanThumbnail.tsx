"use client";

import Image from "next/image";

export function DocumentScanThumbnail({
  src,
  alt,
  scanning,
}: {
  src: string;
  alt: string;
  scanning: boolean;
}) {
  return (
    <div className="relative aspect-[4/3] w-full max-w-xs overflow-hidden rounded border border-hairline bg-ink">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        unoptimized
      />
      {scanning && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-seal/5" />
          <div
            className="pointer-events-none absolute left-0 h-px w-full bg-seal/80 shadow-[0_0_8px_rgba(201,154,70,0.6)] motion-safe:animate-scan"
            aria-hidden
          />
        </>
      )}
    </div>
  );
}
