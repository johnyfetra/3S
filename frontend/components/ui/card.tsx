import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-white/10 bg-[#111111] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.24)]", className)} {...props} />;
}
