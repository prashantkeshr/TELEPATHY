import { useNavigate } from "react-router-dom";
import { Shuffle, Compass, Hash, Languages, Lightbulb, Users, Sparkles, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardInteractive } from "@/components/ui/Card";
import { PhaseNotice } from "@/components/ui/PhaseNotice";

type Vivid = "violet" | "cyan" | "blue" | "amber" | "rose" | "emerald";

interface Mode {
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

const modes: Mode[] = [
  { icon: Shuffle, title: "Random", description: "Get matched with anyone available.", to: "/discover/random", color: "violet" },
  { icon: Compass, title: "Interests", description: "Match by shared interests.", to: "/discover/random?mode=interests", color: "cyan" },
  { icon: Hash, title: "Topics", description: "Join a focused topic room.", to: "/rooms?type=topic", color: "emerald" },
  { icon: Languages, title: "Languages", description: "Practice a language together.", to: "/discover/random?mode=language", color: "blue" },
  { icon: Lightbulb, title: "Knowledge", description: "Teach something, learn something.", to: "/discover/random?mode=knowledge", color: "amber" },
  { icon: Users, title: "Friendship", description: "Meet people to stay in touch with.", to: "/discover/random?mode=friendship", color: "rose" },
  { icon: Sparkles, title: "Ideas", description: "Find someone interested in your idea.", to: "/ideas", color: "violet" },
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
          {modes.map((mode, i) => (
            <CardInteractive
              key={mode.title}
              onClick={() => navigate(mode.to)}
              className="hover-lift animate-fade-in-up flex flex-col gap-3 p-4"
              style={{ "--stagger-delay": `${i * 50}ms` } as React.CSSProperties}
            >
              <div className={`flex size-9 items-center justify-center rounded-[var(--radius-md)] ${colorClasses[mode.color]}`}>
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
