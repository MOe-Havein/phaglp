"use client";

import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
  CloudinaryUploadWidgetError,
} from "next-cloudinary";
import { UploadCloud } from "lucide-react";
import { toast } from "sonner";

interface CloudinaryUploadButtonProps {
  onUpload: (url: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function CloudinaryUploadButton({
  onUpload,
  className = "",
  children,
}: CloudinaryUploadButtonProps) {
  return (
    <CldUploadButton
      signatureEndpoint="/api/sign-cloudinary-params"
      options={{
        multiple: false,
        folder: "phaglp/lectures",
      }}
      onSuccess={(result: CloudinaryUploadWidgetResults) => {
        if (typeof result.info === "object" && result.info !== null && "secure_url" in result.info) {
          onUpload(result.info.secure_url as string);
          toast.success("Image uploaded successfully!");
        }
      }}
      onError={(error: CloudinaryUploadWidgetError) => {
        console.error("Upload failed", error);
        toast.error("Failed to upload image");
      }}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 ${className}`}
    >
      <UploadCloud className="w-4 h-4 mr-2" />
      {children || "Upload Image"}
    </CldUploadButton>
  );
}
