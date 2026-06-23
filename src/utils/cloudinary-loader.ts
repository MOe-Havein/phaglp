// src/utils/cloudinary-loader.ts

interface NextImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

// Next.js requires the 'default' export keyword for image loaders
export default function cloudinaryLoader({ src, width, quality }: NextImageLoaderProps): string {
  const q = quality || "auto";
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "phaglp";

  // 1. Local assets (starting with /)
  if (src.startsWith("/")) {
    return src;
  }

  // 2. Already a Cloudinary URL
  if (src.includes("res.cloudinary.com")) {
    // If it is an upload URL, insert width and quality transformations
    if (src.includes("/image/upload/")) {
      return src.replace("/image/upload/", `/image/upload/f_auto,q_${q},w_${width},c_limit/`);
    }
    return src;
  }

  // 3. External HTTP/HTTPS URLs (fetch through Cloudinary)
  if (src.startsWith("http://") || src.startsWith("https://")) {
    return `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_${q},w_${width},c_limit/${encodeURIComponent(src)}`;
  }

  // 4. Cloudinary Public ID (e.g. phaglp/some_image_id)
  return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_${q},w_${width},c_limit/${src}`;
}
