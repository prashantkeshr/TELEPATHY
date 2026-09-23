import { cn } from "@/utils/cn";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, Circle } from "lucide-react";

export type ConnectionQuality = "excellent" | "good" | "unstable" | "reconnecting" | "offline";

const config: Record<
  ConnectionQuality,
  { icon: typeof Circle; label: string; className: string; spin?: boolean }
> = {
  excellent: { icon: CheckCircle2, label: "Excellent", className: "text-success" },
  good: { icon: CheckCircle2, label: "Good", className: "text-success" },
  unstable: { icon: AlertTriangle, label: "Unstable", className: "text-warning" },
  reconnecting: { icon: RefreshCw, label: "Reconnecting", className: "text-warning", spin: true },
  offline: { icon: XCircle, label: "Offline", className: "text-danger" },
};

export function StatusIndicator({
  quality,
  showLabel = true,
  className,
}: {
  quality: ConnectionQuality;
  showLabel?: boolean;
  className?: string;
}) {
  const { icon: Icon, label, className: colorClass, spin } = config[quality];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", colorClass, className)}>
      <Icon className={cn("size-3.5", spin && "animate-spin")} />
      {showLabel && label}
    </span>
  );
}
