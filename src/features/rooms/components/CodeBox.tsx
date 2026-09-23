import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";

export function CodeBox({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <IconButton label={copied ? "Copied" : "Copy"} variant="ghost" size="sm" onClick={copy}>
          {copied ? <Check /> : <Copy />}
        </IconButton>
      </div>
      <textarea
        readOnly
        value={code}
        rows={4}
        onFocus={(e) => e.target.select()}
        className="w-full resize-none rounded-[var(--radius-md)] border border-border-strong bg-surface-2 px-3 py-2 font-mono text-xs text-text-secondary outline-none"
      />
    </div>
  );
}
