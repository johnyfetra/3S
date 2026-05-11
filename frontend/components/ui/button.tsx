import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-ink text-white hover:bg-black dark:bg-amber-300 dark:text-black",
  secondary: "border border-black/10 bg-white text-ink hover:bg-amber-50 dark:border-white/10 dark:bg-white/10 dark:text-white",
  ghost: "text-ink hover:bg-black/5 dark:text-white dark:hover:bg-white/10",
  danger: "bg-signal text-white hover:bg-red-600"
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-semibold transition",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

