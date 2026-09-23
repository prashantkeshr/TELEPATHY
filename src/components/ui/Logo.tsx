import { cn } from "@/utils/cn";

export function Logo({ size = 28, className }: { size?: number; className?: string }) {
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
      <rect width="64" height="64" rx="16" className="fill-surface-3" />
      <path
        d="M14 24C14 18.4771 18.4771 14 24 14C29.5228 14 34 18.4771 34 24C34 29.5228 29.5228 34 24 34"
        stroke="url(#tp_grad_a)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M50 40C50 45.5228 45.5228 50 40 50C34.4772 50 30 45.5228 30 40C30 34.4772 34.4772 30 40 30"
        stroke="url(#tp_grad_b)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="32" cy="32" r="3.5" className="fill-text-primary" />
      <defs>
        <linearGradient id="tp_grad_a" x1="14" y1="14" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C8CF8" />
          <stop offset="1" stopColor="#4ADEDE" />
        </linearGradient>
        <linearGradient id="tp_grad_b" x1="30" y1="30" x2="50" y2="50" gradientUnits="userSpaceOnUse">
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
