import { useRef } from "react";
import { Send, X, Code2 } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { Button } from "@/components/ui/Button";
import type { MessageRecord } from "@/services/storage/db";

export function Composer({
  value,
  onChange,
  onSend,
  replyTo,
  onCancelReply,
  isCode,
  onToggleCode,
  disabled,
  disabledReason,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  replyTo?: MessageRecord;
  onCancelReply: () => void;
  isCode: boolean;
  onToggleCode: () => void;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const send = () => {
    if (!value.trim()) return;
    onSend();
  };

  return (
    <div className="border-t border-border bg-bg-elevated px-4 py-3">
      {replyTo && (
        <div className="mb-2 flex items-center justify-between rounded-[var(--radius-sm)] border-l-2 border-accent bg-surface-2 px-3 py-1.5">
          <p className="truncate text-xs text-text-secondary">
            Replying to <span className="text-text-primary">{replyTo.text}</span>
          </p>
          <IconButton label="Cancel reply" variant="ghost" size="sm" onClick={onCancelReply}>
            <X />
          </IconButton>
        </div>
      )}
      {disabled && disabledReason && (
        <p className="mb-2 text-xs text-text-tertiary">{disabledReason}</p>
      )}
      <div className="flex items-end gap-2">
        <IconButton
          label={isCode ? "Code block on" : "Send as code block"}
          variant={isCode ? "accent" : "default"}
          onClick={onToggleCode}
        >
          <Code2 />
        </IconButton>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          disabled={disabled}
          placeholder={isCode ? "Paste code…" : "Write a message…"}
          rows={1}
          className="max-h-32 flex-1 resize-none rounded-[var(--radius-md)] border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent disabled:opacity-50"
          style={{ fontFamily: isCode ? "var(--font-mono)" : undefined }}
        />
        <Button size="md" iconLeft={<Send />} onClick={send} disabled={disabled || !value.trim()}>
          Send
        </Button>
      </div>
    </div>
  );
}
