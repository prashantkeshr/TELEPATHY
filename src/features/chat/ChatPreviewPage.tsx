import { useState } from "react";
import { Info } from "lucide-react";
import { MessageBubble } from "@/features/chat/components/MessageBubble";
import { Composer } from "@/features/chat/components/Composer";
import { ChatHeader } from "@/features/chat/components/ChatHeader";
import type { MessageRecord } from "@/services/storage/db";

let seq = 0;
const nextId = () => `preview-${Date.now()}-${seq++}`;

const seedMessages: MessageRecord[] = [
  {
    id: nextId(),
    conversationId: "preview",
    sender: "peer",
    text: "This is what a message from someone else looks like.",
    reactions: [],
    createdAt: Date.now() - 60000,
  },
  {
    id: nextId(),
    conversationId: "preview",
    sender: "me",
    text: "And this is what your own messages look like. Try replying, reacting, or sending a code block below.",
    reactions: ["👍"],
    createdAt: Date.now() - 30000,
  },
];

/**
 * A static, clearly-labeled design preview of the chat interface — not a
 * real conversation, no peer, nothing sent anywhere. Nothing here writes to
 * IndexedDB; state resets on reload. Exists because real-time chat needs
 * Phase 5 (WebRTC/signaling), but the interface itself is real and ready.
 */
export function ChatPreviewPage() {
  const [messages, setMessages] = useState<MessageRecord[]>(seedMessages);
  const [value, setValue] = useState("");
  const [replyToId, setReplyToId] = useState<string | null>(null);
  const [isCode, setIsCode] = useState(false);

  const replyToMessage = messages.find((m) => m.id === replyToId);
  const messageById = new Map(messages.map((m) => [m.id, m]));

  const send = () => {
    const text = value.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: nextId(),
        conversationId: "preview",
        sender: "me",
        text,
        isCode,
        replyToId: replyToId ?? undefined,
        reactions: [],
        createdAt: Date.now(),
      },
    ]);
    setValue("");
    setReplyToId(null);
    setIsCode(false);
  };

  const react = (id: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, reactions: m.reactions.includes(emoji) ? m.reactions.filter((r) => r !== emoji) : [...m.reactions, emoji] }
          : m,
      ),
    );
  };

  const remove = (id: string) => setMessages((prev) => prev.filter((m) => m.id !== id));

  return (
    <div className="flex h-full min-h-[calc(100dvh-56px)] flex-col lg:min-h-dvh">
      <div className="flex items-center gap-2 border-b border-warning/30 bg-warning-muted px-4 py-2 text-xs text-warning">
        <Info className="size-3.5 shrink-0" />
        Design preview — not a real conversation. Nothing here is saved or sent anywhere.
      </div>

      <ChatHeader
        nickname="Preview Contact"
        sharedInterests={["Example"]}
        connectionState="connected"
        backTo="/chats"
      />

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            replyToMessage={m.replyToId ? messageById.get(m.replyToId) : undefined}
            onReply={setReplyToId}
            onDelete={remove}
            onReact={react}
          />
        ))}
      </div>

      <Composer
        value={value}
        onChange={setValue}
        onSend={send}
        replyTo={replyToMessage}
        onCancelReply={() => setReplyToId(null)}
        isCode={isCode}
        onToggleCode={() => setIsCode((v) => !v)}
      />
    </div>
  );
}
