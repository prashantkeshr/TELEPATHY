import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-text-on-accent hover:bg-accent-hover active:bg-accent-active",
  secondary:
    "bg-surface-3 text-text-primary hover:bg-surface-3/80 border border-border",
  outline:
    "bg-transparent text-text-primary border border-border-strong hover:bg-surface-2",
  ghost: "bg-transparent text-text-primary hover:bg-surface-2",
  danger: "bg-danger text-white hover:brightness-110",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-[13px] gap-1.5 rounded-[var(--radius-sm)]",
  md: "h-10 px-4 text-sm gap-2 rounded-[var(--radius-md)]",
  lg: "h-11 px-5 text-[15px] gap-2 rounded-[var(--radius-md)]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      iconLeft,
      iconRight,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "select-none whitespace-nowrap",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          iconLeft && <span className="shrink-0 [&>svg]:size-4">{iconLeft}</span>
        )}
        {children}
        {!loading && iconRight && (
          <span className="shrink-0 [&>svg]:size-4">{iconRight}</span>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";
