import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Shuffle,
  Compass,
  Languages,
  Lightbulb,
  MessageCircle,
  Hash,
  DoorClosed,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { db } from "@/services/storage/db";
import { Card, CardInteractive } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

interface PrimaryAction {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
}

const primaryActions: PrimaryAction[] = [
  { icon: Shuffle, title: "Random Conversation", description: "Meet someone unexpected.", to: "/discover/random" },
  { icon: Compass, title: "Find by Interest", description: "Talk about something you both enjoy.", to: "/discover?mode=interests" },
  { icon: Languages, title: "Language Exchange", description: "Practice a language with someone new.", to: "/discover?mode=language" },
  { icon: Lightbulb, title: "Knowledge Exchange", description: "Teach something. Learn something.", to: "/discover?mode=knowledge" },
  { icon: Sparkles, title: "Talk About an Idea", description: "Find someone interested in your idea.", to: "/ideas" },
  { icon: Hash, title: "Join a Topic", description: "Enter a focused conversation room.", to: "/rooms?type=topic" },
  { icon: DoorClosed, title: "Create Private Room", description: "Invite someone directly.", to: "/rooms?type=private" },
];

export function HomePage() {
  const navigate = useNavigate();
  const savedPeopleCount = useLiveQuery(() => db.savedPeople.count(), [], 0);
  const conversationCount = useLiveQuery(() => db.conversations.count(), [], 0);
  const ideaCount = useLiveQuery(() => db.ideas.count(), [], 0);

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
          Who would you like to meet?
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Meet someone new. Find something in common. Start a meaningful conversation.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {primaryActions.map((action) => (
          <CardInteractive
            key={action.title}
            onClick={() => navigate(action.to)}
            className="flex flex-col gap-3 p-4"
          >
            <div className="flex size-9 items-center justify-center rounded-[var(--radius-md)] bg-accent-muted text-accent">
              <action.icon className="size-4.5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-text-primary">{action.title}</p>
              <p className="mt-0.5 text-[13px] text-text-secondary">{action.description}</p>
            </div>
          </CardInteractive>
        ))}
      </div>

      <section className="mt-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">Continue</h2>
        </div>
        {conversationCount === 0 ? (
          <EmptyState
            icon={<MessageCircle />}
            title="No conversations yet"
            description="Conversations you save will show up here so you can pick them back up."
            action={
              <Button size="sm" variant="outline" onClick={() => navigate("/discover/random")}>
                Start a conversation
              </Button>
            }
          />
        ) : null}
      </section>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Saved People</h2>
            <Users className="size-4 text-text-tertiary" />
          </div>
          {savedPeopleCount === 0 ? (
            <p className="text-[13px] text-text-secondary">
              Save someone after a conversation to find them here later.
            </p>
          ) : (
            <p className="text-[13px] text-text-secondary">{savedPeopleCount} saved</p>
          )}
        </Card>
        <Card className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">Your Ideas</h2>
            <Lightbulb className="size-4 text-text-tertiary" />
          </div>
          {ideaCount === 0 ? (
            <p className="text-[13px] text-text-secondary">
              Capture something you're building, teaching, or want to learn.
            </p>
          ) : (
            <p className="text-[13px] text-text-secondary">{ideaCount} idea(s)</p>
          )}
        </Card>
      </div>
    </div>
  );
}
