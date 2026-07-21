import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] tracking-[0.1em] uppercase font-body font-medium",
  {
    variants: {
      variant: {
        default: "bg-gold/10 text-gold",
        success: "bg-sage/10 text-sage",
        warning: "bg-amber-50 text-amber-600",
        destructive: "bg-red-50 text-red-600",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
