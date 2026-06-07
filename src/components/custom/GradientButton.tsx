import React from "react";

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Button label or content.
   */
  children: React.ReactNode;
}

/**
 * GradientButton – a reusable button that uses the custom Tailwind colors
 * `laser`, `inferno`, and `celebration` defined in `tailwind.config.ts`.
 *
 * The button displays a left‑to‑right gradient from `laser` → `inferno` →
 * `celebration`. It has a subtle hover scale and active shadow to feel
 * premium and interactive.
 */
export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  className = "",
  ...rest
}) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-laser via-inferno to-celebration transition-transform hover:scale-105 active:shadow-inner ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};
