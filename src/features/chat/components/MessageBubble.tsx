import { useState } from "react";
import { Copy, Reply, Trash2, Smile, Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { linkify } from "@/utils/linkify";
import { IconButton } from "@/components/ui/IconButton";
import type { MessageRecord } from "@/services/storage/db";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "🎯", "🤔"];

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function MessageBubble({
  message,
  replyToMessage,
  onReply,
  onDelete,
  onReact,
}: {
  message: MessageRecord;
  replyToMessage?: MessageRecord;
  onReply: (id: string) => void;
  onDelete: (id: string) => void;
  onReact: (id: string, emoji: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const isMe = message.sender === "me";

  const copy = async () => {
    await navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className={cn("group flex gap-2", isMe ? "flex-row-reverse" : "flex-row")}>
      <div className={cn("flex max-w-[75%] flex-col gap-1", isMe ? "items-end" : "items-start")}>
        {replyToMessage && (
          <div className="max-w-full truncate rounded-[var(--radius-sm)] border-l-2 border-accent bg-surface-2 px-2.5 py-1 text-xs text-text-tertiary">
            {replyToMessage.text}
          </div>
        )}

        <div className="flex items-end gap-1.5">
          {!isMe && (
            <div className="flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <MessageActions onCopy={copy} onReply={() => onReply(message.id)} onReact={() => setPickerOpen((v) => !v)} copied={copied} />
            </div>
          )}

          <div
            className={cn(
              "rounded-[var(--radius-lg)] px-3.5 py-2.5 text-sm",
              isMe ? "bg-accent text-text-on-accent" : "bg-surface-3 text-text-primary",
              message.isCode && "font-mono text-[13px]",
            )}
          >
            {message.isCode ? (
              <pre className="whitespace-pre-wrap break-words">{message.text}</pre>
            ) : (
              <span className="whitespace-pre-wrap break-words">{linkify(message.text)}</span>
            )}
          </div>

          {isMe && (
            <div className="flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <MessageActions
                onCopy={copy}
                onReply={() => onReply(message.id)}
                onReact={() => setPickerOpen((v) => !v)}
                onDelete={() => onDelete(message.id)}
                copied={copied}
              />
            </div>
          )}
        </div>

        {pickerOpen && (
          <div className="flex gap-1 rounded-full border border-border bg-surface-2 px-2 py-1 shadow-lg">
            {QUICK_REACTIONS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onReact(message.id, emoji);
                  setPickerOpen(false);
                }}
                className="rounded-full px-1 text-base hover:bg-surface-3"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {message.reactions.length > 0 && (
          <div className="flex gap-1">
            {message.reactions.map((emoji, i) => (
              <span key={i} className="rounded-full bg-surface-2 px-1.5 py-0.5 text-xs">
                {emoji}
              </span>
            ))}
          </div>
        )}

        <span className="px-1 text-[11px] text-text-tertiary">{formatTime(message.createdAt)}</span>
      </div>
    </div>
  );
}

function MessageActions({
  onCopy,
  onReply,
  onReact,
  onDelete,
  copied,
}: {
  onCopy: () => void;
  onReply: () => void;
  onReact: () => void;
  onDelete?: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5">
      <IconButton label="React" variant="ghost" size="sm" onClick={onReact}>
        <Smile />
      </IconButton>
      <IconButton label="Reply" variant="ghost" size="sm" onClick={onReply}>
        <Reply />
      </IconButton>
      <IconButton label={copied ? "Copied" : "Copy"} variant="ghost" size="sm" onClick={onCopy}>
        {copied ? <Check /> : <Copy />}
      </IconButton>
      {onDelete && (
        <IconButton label="Delete" variant="ghost" size="sm" onClick={onDelete}>
          <Trash2 />
        </IconButton>
      )}
    </div>
  );
}
