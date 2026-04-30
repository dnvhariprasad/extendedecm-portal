import Link from "next/link";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[#145b73] focus-visible:outline-[var(--primary)]",
        secondary: "border border-[var(--border)] bg-white text-[#344054] hover:bg-[#f2f4f7] focus-visible:outline-[var(--primary)]",
        ghost: "text-[#344054] hover:bg-[#eef2f6]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ className, variant, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant }), className)} {...props} />;
}

export function LinkButton({
  href,
  children,
  className,
  variant,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: VariantProps<typeof buttonVariants>["variant"];
}) {
  return (
    <Link className={cn(buttonVariants({ variant }), className)} href={href}>
      {children}
    </Link>
  );
}
