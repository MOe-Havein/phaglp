import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-300 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: 
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/80",
        destructive: 
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:scale-95 dark:bg-red-600 dark:text-slate-950 dark:hover:bg-red-500",
        outline:
          "border border-primary text-primary bg-transparent shadow-sm hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-slate-50",
        secondary:
          "bg-transparent border border-primary text-primary shadow-sm hover:bg-primary/5 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        ghost: 
          "text-primary hover:bg-primary/5 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-50",
        link: 
          "text-primary underline-offset-4 hover:underline dark:text-blue-400",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8 text-base",
        icon: "h-10 w-10 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
