import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type Tone = "neutral" | "accent" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface-3 text-text-secondary border-border",
  accent: "bg-accent-muted text-accent border-transparent",
  success: "bg-success-muted text-success border-transparent",
  warning: "bg-warning-muted text-warning border-transparent",
  danger: "bg-danger-muted text-danger border-transparent",
  info: "bg-info-muted text-info border-transparent",
};

export function Badge({
  children,
  tone = "neutral",
  icon,
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {icon && <span className="[&>svg]:size-3">{icon}</span>}
      {children}
    </span>
  );
}
