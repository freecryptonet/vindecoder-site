import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Card({
  className,
  as: Tag = "div",
  ...props
}: HTMLAttributes<HTMLElement> & { as?: "div" | "section" | "article" }) {
  return (
    <Tag
      className={cn(
        "rounded-card border border-border bg-surface p-6 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}
