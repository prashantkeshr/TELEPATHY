import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Tooltip } from "@/components/ui/Tooltip";

type Variant = "default" | "ghost" | "accent" | "danger";
type Size = "sm" | "md" | "lg";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: Variant;
  size?: Size;
  active?: boolean;
}

const variantClasses: Record<Variant, string> = {
  default: "bg-surface-2 text-text-secondary hover:text-text-primary hover:bg-surface-3 border border-border",
  ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-2",
  accent: "bg-accent-muted text-accent hover:bg-accent hover:text-text-on-accent",
  danger: "bg-transparent text-text-secondary hover:text-danger hover:bg-danger-muted",
};

const sizeClasses: Record<Size, string> = {
  sm: "size-7 [&>svg]:size-3.5 rounded-[var(--radius-sm)]",
  md: "size-9 [&>svg]:size-4 rounded-[var(--radius-md)]",
  lg: "size-11 [&>svg]:size-5 rounded-[var(--radius-md)]",
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, label, variant = "default", size = "md", active, ...props }, ref) => {
    return (
      <Tooltip content={label}>
        <button
          ref={ref}
          aria-label={label}
          className={cn(
            "inline-flex items-center justify-center shrink-0 transition-colors duration-150",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            active && "bg-accent-muted text-accent",
            variantClasses[variant],
            sizeClasses[size],
            className,
          )}
          {...props}
        />
      </Tooltip>
    );
  },
);
IconButton.displayName = "IconButton";
