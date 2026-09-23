import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { MessageSquare, Eye, Bookmark } from "lucide-react";
import { db } from "@/services/storage/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { CardInteractive } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

export function ChatsPage() {
  const navigate = useNavigate();
  const conversations = useLiveQuery(() => db.conversations.orderBy("startedAt").reverse().toArray(), [], []);

  return (
    <div>
      <PageHeader
        title="Chats"
        description="Your saved and ongoing conversations."
        actions={
          <Button size="sm" variant="ghost" iconLeft={<Eye />} onClick={() => navigate("/chats/preview")}>
            Preview interface
          </Button>
        }
      />
      <div className="px-5 py-6 sm:px-8">
        {conversations && conversations.length > 0 ? (
          <div className="space-y-2">
            {conversations.map((c) => (
              <CardInteractive
                key={c.id}
                onClick={() => navigate(`/chats/${c.id}`)}
                className="flex items-center gap-3 p-3.5"
              >
                <Avatar name={c.peerNickname} src={c.peerAvatarDataUrl} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-text-primary">{c.peerNickname}</p>
                    {c.savedAt && <Bookmark className="size-3.5 shrink-0 text-accent" />}
                  </div>
                  <p className="truncate text-xs text-text-tertiary">
                    {new Date(c.startedAt).toLocaleDateString()}
                  </p>
                </div>
                {c.sharedInterests.slice(0, 1).map((i) => (
                  <Badge key={i}>{i}</Badge>
                ))}
              </CardInteractive>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<MessageSquare />}
            title="No conversations yet"
            description="Conversations you have and save will appear here. Real-time messaging needs the Phase 5 signaling adapter, which isn't connected yet — but you can see exactly what the chat interface looks like."
            action={
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => navigate("/discover")}>
                  Go to Discover
                </Button>
                <Button size="sm" variant="ghost" iconLeft={<Eye />} onClick={() => navigate("/chats/preview")}>
                  Preview interface
                </Button>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}
