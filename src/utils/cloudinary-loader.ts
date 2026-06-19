// src/utils/cloudinary-loader.ts

interface NextImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

// Next.js requires the 'default' export keyword for image loaders
export default function cloudinaryLoader({ src, width }: NextImageLoaderProps): string {
  if (!src.startsWith("http")) return src;
  
  // Appends the Next.js target width dynamically to optimize payload bytes
  return `https://cloudinary.com{width}/${src}`;
}
