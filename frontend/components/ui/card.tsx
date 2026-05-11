import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-black/10 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] dark:border-white/10 dark:bg-[#111111] dark:shadow-[0_24px_70px_rgba(0,0,0,0.24)]", className)} {...props} />;
}
