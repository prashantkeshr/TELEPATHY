import { useId } from "react";
import { cn } from "@/utils/cn";

export function Logo({
  size = 28,
  className,
  animated = false,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  // Gradient ids must be unique per instance: the app renders several Logos
  // (sidebar, mobile bar, headers) and some sit inside display:none
  // containers. Browsers won't resolve url(#id) to a gradient inside a
  // hidden subtree, so a shared id left the visible logo with no arcs.
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradA = `tp_grad_a_${uid}`;
  const gradB = `tp_grad_b_${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx="14" className="fill-surface-3" />
      <path
        d="M10 23C10 15.8203 15.8203 10 23 10C30.1797 10 36 15.8203 36 23C36 30.1797 30.1797 36 23 36"
        stroke={`url(#${gradA})`}
        strokeWidth="7"
        strokeLinecap="round"
        style={
          animated
            ? { strokeDasharray: 62, strokeDashoffset: 62, animation: "draw-in 1s ease-out 0.1s forwards" }
            : undefined
        }
      />
      <path
        d="M54 41C54 48.1797 48.1797 54 41 54C33.8203 54 28 48.1797 28 41C28 33.8203 33.8203 28 41 28"
        stroke={`url(#${gradB})`}
        strokeWidth="7"
        strokeLinecap="round"
        style={
          animated
            ? { strokeDasharray: 62, strokeDashoffset: 62, animation: "draw-in 1s ease-out 0.5s forwards" }
            : undefined
        }
      />
      <circle
        cx="32"
        cy="32"
        r="6"
        className="fill-text-primary"
        style={animated ? { animation: "pulse-glow 2.4s ease-in-out 1.2s infinite" } : undefined}
      />
      <defs>
        <linearGradient id={gradA} x1="10" y1="10" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C8CF8" />
          <stop offset="1" stopColor="#4ADEDE" />
        </linearGradient>
        <linearGradient id={gradB} x1="28" y1="28" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4ADEDE" />
          <stop offset="1" stopColor="#7C8CF8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Logo size={26} />
      <span className="text-[15px] font-semibold tracking-tight text-text-primary">
        Telepathy
      </span>
    </div>
  );
}
