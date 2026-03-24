import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 border-foreground px-2.5 py-0.5 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-[2px_2px_0px_0px_hsl(var(--foreground))] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_hsl(var(--foreground))]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-brutal-yellow hover:text-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-brutal-teal hover:text-white",
        destructive: "bg-destructive text-destructive-foreground hover:bg-brutal-red",
        outline: "bg-background text-foreground hover:bg-brutal-blue hover:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
