import type { ButtonHTMLAttributes } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  onRemove?: () => void;
}

export function Chip({ selected, onRemove, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors duration-150",
        selected
          ? "bg-accent-muted border-accent text-accent"
          : "bg-surface-2 border-border text-text-secondary hover:text-text-primary hover:border-border-strong",
        className,
      )}
      {...props}
    >
      {children}
      {onRemove && (
        <span
          role="button"
          aria-label="Remove"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="rounded-full hover:bg-surface-3 -mr-1 p-0.5"
        >
          <X className="size-3" />
        </span>
      )}
    </button>
  );
}
