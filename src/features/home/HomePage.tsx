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
import { Chip } from "@/components/ui/Chip";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeroVisual } from "@/components/ui/HeroVisual";
import { suggestTopics } from "@/services/matching/topicSuggestions";

type Vivid = "violet" | "cyan" | "blue" | "amber" | "rose" | "emerald";

interface PrimaryAction {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
  color: Vivid;
}

const colorClasses: Record<Vivid, string> = {
  violet: "bg-vivid-violet/15 text-vivid-violet",
  cyan: "bg-vivid-cyan/15 text-vivid-cyan",
  blue: "bg-vivid-blue/15 text-vivid-blue",
  amber: "bg-vivid-amber/15 text-vivid-amber",
  rose: "bg-vivid-rose/15 text-vivid-rose",
  emerald: "bg-vivid-emerald/15 text-vivid-emerald",
};

const primaryActions: PrimaryAction[] = [
  { icon: Shuffle, title: "Random Conversation", description: "Meet someone unexpected.", to: "/discover/random", color: "violet" },
  { icon: Compass, title: "Find by Interest", description: "Talk about something you both enjoy.", to: "/discover?mode=interests", color: "cyan" },
  { icon: Languages, title: "Language Exchange", description: "Practice a language with someone new.", to: "/discover?mode=language", color: "blue" },
  { icon: Lightbulb, title: "Knowledge Exchange", description: "Teach something. Learn something.", to: "/discover?mode=knowledge", color: "amber" },
  { icon: Sparkles, title: "Talk About an Idea", description: "Find someone interested in your idea.", to: "/ideas", color: "rose" },
  { icon: Hash, title: "Join a Topic", description: "Enter a focused conversation room.", to: "/rooms?type=topic", color: "emerald" },
  { icon: DoorClosed, title: "Create Private Room", description: "Invite someone directly.", to: "/rooms?type=private", color: "violet" },
];

export function HomePage() {
  const navigate = useNavigate();
  const profile = useLiveQuery(() => db.profile.get("local"), []);
  const savedPeopleCount = useLiveQuery(() => db.savedPeople.count(), [], 0);
  const conversationCount = useLiveQuery(() => db.conversations.count(), [], 0);
  const ideaCount = useLiveQuery(() => db.ideas.count(), [], 0);
  const topics = profile ? suggestTopics(profile) : [];

  return (
    <div>
      <div className="relative overflow-hidden border-b border-border">
        <div className="aurora-backdrop" />
        <div className="relative mx-auto grid max-w-5xl grid-cols-1 items-center gap-6 px-5 py-10 sm:px-8 md:grid-cols-2 md:py-14">
          <div className="animate-fade-in-up">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Who would you like to <span className="gradient-text">meet</span>?
            </h1>
            <p className="mt-3 max-w-md text-[15px] text-text-secondary">
              Meet someone new. Find something in common. Start a meaningful conversation.
            </p>
          </div>
          <HeroVisual className="mx-auto hidden h-48 w-full max-w-sm md:block" />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {primaryActions.map((action, i) => (
            <CardInteractive
              key={action.title}
              onClick={() => navigate(action.to)}
              className="hover-lift animate-fade-in-up flex flex-col gap-3 p-4"
              style={{ "--stagger-delay": `${i * 60}ms` } as React.CSSProperties}
            >
              <div className={`flex size-9 items-center justify-center rounded-[var(--radius-md)] ${colorClasses[action.color]}`}>
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

        {profile && profile.interests.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-sm font-semibold text-text-primary">Your Interests</h2>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <Chip
                  key={interest}
                  onClick={() => navigate(`/discover/random?mode=interests&interests=${encodeURIComponent(interest)}`)}
                >
                  {interest}
                </Chip>
              ))}
            </div>
          </section>
        )}

        {topics.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-sm font-semibold text-text-primary">Suggested Conversation Topics</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {topics.map((topic) => (
                <Card key={topic} className="hover-lift px-4 py-3 text-sm text-text-primary">
                  {topic}
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="hover-lift p-4">
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
          <Card className="hover-lift p-4">
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
    </div>
  );
}
