import { cn } from "@/utils/cn";

type Size = "xs" | "sm" | "md" | "lg" | "xl";
type Status = "online" | "away" | "offline" | "in-conversation" | undefined;

interface AvatarProps {
  name: string;
  src?: string;
  size?: Size;
  status?: Status;
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-base",
  xl: "size-20 text-xl",
};

const statusDotClasses: Record<NonNullable<Status>, string> = {
  online: "bg-success",
  "in-conversation": "bg-accent",
  away: "bg-warning",
  offline: "bg-text-tertiary",
};

const statusLabel: Record<NonNullable<Status>, string> = {
  online: "Online",
  "in-conversation": "In conversation",
  away: "Away",
  offline: "Offline",
};

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function hueFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

export function Avatar({ name, src, size = "md", status, className }: AvatarProps) {
  const hue = hueFor(name || "?");
  return (
    <span className={cn("relative inline-flex shrink-0", sizeClasses[size], className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="size-full rounded-full object-cover border border-border"
        />
      ) : (
        <span
          className="flex size-full items-center justify-center rounded-full font-semibold text-white border border-border"
          style={{
            background: `linear-gradient(135deg, hsl(${hue} 55% 42%), hsl(${(hue + 40) % 360} 55% 32%))`,
          }}
          aria-hidden="true"
        >
          {initialsFor(name)}
        </span>
      )}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-bg",
            size === "xs" || size === "sm" ? "size-2" : "size-2.5",
            statusDotClasses[status],
          )}
          role="img"
          aria-label={statusLabel[status]}
          title={statusLabel[status]}
        />
      )}
    </span>
  );
}
