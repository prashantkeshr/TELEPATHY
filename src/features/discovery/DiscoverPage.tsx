import { useNavigate } from "react-router-dom";
import { Shuffle, Compass, Hash, Languages, Lightbulb, Users, Sparkles, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardInteractive } from "@/components/ui/Card";
import { PhaseNotice } from "@/components/ui/PhaseNotice";

interface Mode {
  icon: LucideIcon;
  title: string;
  description: string;
  to: string;
}

const modes: Mode[] = [
  { icon: Shuffle, title: "Random", description: "Get matched with anyone available.", to: "/discover/random" },
  { icon: Compass, title: "Interests", description: "Match by shared interests.", to: "/discover/random?mode=interests" },
  { icon: Hash, title: "Topics", description: "Join a focused topic room.", to: "/rooms?type=topic" },
  { icon: Languages, title: "Languages", description: "Practice a language together.", to: "/discover/random?mode=language" },
  { icon: Lightbulb, title: "Knowledge", description: "Teach something, learn something.", to: "/discover/random?mode=knowledge" },
  { icon: Users, title: "Friendship", description: "Meet people to stay in touch with.", to: "/discover/random?mode=friendship" },
  { icon: Sparkles, title: "Ideas", description: "Find someone interested in your idea.", to: "/ideas" },
];

export function DiscoverPage() {
  const navigate = useNavigate();
  return (
    <div>
      <PageHeader
        title="Discover"
        description="Choose how you'd like to meet someone."
      />
      <div className="px-5 py-6 sm:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modes.map((mode) => (
            <CardInteractive
              key={mode.title}
              onClick={() => navigate(mode.to)}
              className="flex flex-col gap-3 p-4"
            >
              <div className="flex size-9 items-center justify-center rounded-[var(--radius-md)] bg-accent-muted text-accent">
                <mode.icon className="size-4.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{mode.title}</p>
                <p className="mt-0.5 text-[13px] text-text-secondary">{mode.description}</p>
              </div>
            </CardInteractive>
          ))}
        </div>

        <div className="mt-6">
          <PhaseNotice>
            Interest, topic, and language filters are being built in Phase 3 (Discovery). Right
            now every mode routes to the same connection flow.
          </PhaseNotice>
        </div>
      </div>
    </div>
  );
}
