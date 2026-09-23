import { useNavigate } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export function ChatsPage() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader title="Chats" description="Your saved and ongoing conversations." />
      <div className="px-5 py-6 sm:px-8">
        <EmptyState
          icon={<MessageSquare />}
          title="No conversations yet"
          description="The chat experience — messages, reactions, replies, and conversation tools — lands in Phase 4. Start a conversation once matching is connected to see it here."
          action={
            <Button size="sm" variant="outline" onClick={() => navigate("/discover")}>
              Go to Discover
            </Button>
          }
        />
      </div>
    </div>
  );
}
