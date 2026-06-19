import React from "react";
import Image from "next/image";
import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

// Define strict typing parameters matching standard design variants
export interface SpinnerProps extends React.ComponentProps<"div"> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "muted" | "white";
  showLogo?: boolean; // 🆕 Toggles the central transparent app logo
}

function Spinner({
  size = "md",
  variant = "primary",
  showLogo = false,
  className,
  children,
  ...props
}: SpinnerProps) {
  // Sizing Layout Dictionary Mapping
  const sizeMap = {
    sm: "size-4 border-2",
    md: "size-6 border-2",
    lg: "size-10 border-4",
    xl: "size-16 border-4",
  };

  // Color Palette Theme Matrix
  const variantMap = {
    primary: "text-blue-400 border-blue-400/20 border-t-blue-400",
    secondary:
      "text-perfectsky-400 border-perfectsky-400/20 border-t-perfectsky-400",
    muted: "text-gray-400 border-gray-400/20 border-t-gray-400",
    white: "text-white border-white/20 border-t-white",
  };

  // Force large sizing rules if logo background tracking is requested
  const resolvedSize = showLogo ? "xl" : size;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "flex flex-col items-center justify-center gap-2 text-center",
        className,
      )}
      {...props}
    >
      <div className="relative flex items-center justify-center">
        {showLogo ? (
          <>
            {/* 🌀 Custom Dual-Layer Asset Spinner Track */}
            <div
              className={cn(
                "rounded-full animate-spin",
                sizeMap[resolvedSize],
                variantMap[variant],
              )}
            />
            {/* Inner Glowing Aura Backplane */}
            <div className="absolute size-10 rounded-full bg-blue-500/10 blur-md animate-pulse" />

            {/* Central Transparent Application Logo Asset (Stays Upright) */}
            <div className="absolute size-9 animate-pulse [animation-duration:2s]">
              <Image
                src="/phaglp-logo.png"
                alt="Loading..."
                fill
                sizes="36px"
                className="object-contain"
                priority
              />
            </div>
          </>
        ) : (
          /* Standard Lightweight Inline Lucide Engine Spinner Wrapper */
          <Loader2Icon
            className={cn(
              "animate-spin",
              sizeMap[resolvedSize],
              variant === "white" ? "text-white" : "text-blue-400",
            )}
          />
        )}
      </div>

      {/* Render optional child string labels beneath the graphic engine */}
      {children && (
        <span
          className={cn(
            "text-xs font-semibold tracking-wide",
            variant === "white" ? "text-gray-200" : "text-blue-200",
          )}
        >
          {children}
        </span>
      )}
    </div>
  );
}

export { Spinner };
