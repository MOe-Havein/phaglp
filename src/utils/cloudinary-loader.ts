// src/utils/cloudinary-loader.ts

interface NextImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

// Next.js requires the 'default' export keyword for image loaders
export default function cloudinaryLoader({ src, width, quality }: NextImageLoaderProps): string {
  if (!src.startsWith("http")) return src;
  
  // Appends the Next.js target width dynamically to optimize payload bytes
  const q = quality || "auto";
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
  return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_${q},w_${width},c_limit/${src}`;
}
