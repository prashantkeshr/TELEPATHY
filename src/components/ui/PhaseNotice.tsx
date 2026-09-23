import { Construction } from "lucide-react";
import type { ReactNode } from "react";

export function PhaseNotice({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-text-secondary">
      <Construction className="mt-0.5 size-4 shrink-0 text-text-tertiary" />
      <p>{children}</p>
    </div>
  );
}
