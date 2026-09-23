import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { Shuffle, Compass, Hash, Languages, Lightbulb, Users, Sparkles, ArrowRight, type LucideIcon } from "lucide-react";
import { db } from "@/services/storage/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardInteractive, Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { PhaseNotice } from "@/components/ui/PhaseNotice";
import { INTEREST_OPTIONS, INTENT_OPTIONS, LANGUAGE_OPTIONS } from "@/constants/profileOptions";
import { toggleItem } from "@/features/profile/onboarding/types";

type Vivid = "violet" | "cyan" | "blue" | "amber" | "rose" | "emerald";
type ModeKey = "random" | "interests" | "language" | "knowledge" | "friendship";

interface Mode {
  key: ModeKey | "topics" | "ideas";
  icon: LucideIcon;
  title: string;
  description: string;
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
  { key: "random", icon: Shuffle, title: "Random", description: "Get matched with anyone available.", color: "violet" },
  { key: "interests", icon: Compass, title: "Interests", description: "Match by shared interests.", color: "cyan" },
  { key: "topics", icon: Hash, title: "Topics", description: "Join a focused topic room.", color: "emerald" },
  { key: "language", icon: Languages, title: "Languages", description: "Practice a language together.", color: "blue" },
  { key: "knowledge", icon: Lightbulb, title: "Knowledge", description: "Teach something, learn something.", color: "amber" },
  { key: "friendship", icon: Users, title: "Friendship", description: "Meet people to stay in touch with.", color: "rose" },
  { key: "ideas", icon: Sparkles, title: "Ideas", description: "Find someone interested in your idea.", color: "violet" },
];

const filterableModes: ModeKey[] = ["random", "interests", "language", "knowledge", "friendship"];

export function DiscoverPage() {
  const navigate = useNavigate();
  const profile = useLiveQuery(() => db.profile.get("local"), []);

  const [selectedMode, setSelectedMode] = useState<ModeKey | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [language, setLanguage] = useState<string | null>(null);
  const [intents, setIntents] = useState<string[]>([]);
  const [prefilled, setPrefilled] = useState(false);

  useEffect(() => {
    if (profile && !prefilled) {
      setInterests(profile.interests);
      setIntents(profile.intents);
      setLanguage(profile.preferredLanguage || null);
      setPrefilled(true);
    }
  }, [profile, prefilled]);

  const selectMode = (mode: Mode) => {
    if (mode.key === "topics") return navigate("/rooms?type=topic");
    if (mode.key === "ideas") return navigate("/ideas");
    setSelectedMode(mode.key);
  };

  const startSearch = () => {
    const params = new URLSearchParams();
    if (selectedMode) params.set("mode", selectedMode);
    if (interests.length) params.set("interests", interests.join(","));
    if (language) params.set("language", language);
    if (intents.length) params.set("intents", intents.join(","));
    navigate(`/discover/random?${params.toString()}`);
  };

  return (
    <div>
      <PageHeader title="Discover" description="Choose how you'd like to meet someone." />
      <div className="px-5 py-6 sm:px-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modes.map((mode, i) => (
            <CardInteractive
              key={mode.title}
              onClick={() => selectMode(mode)}
              className={`hover-lift animate-fade-in-up flex flex-col gap-3 p-4 ${
                selectedMode === mode.key ? "border-accent" : ""
              }`}
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

        {selectedMode && filterableModes.includes(selectedMode) && (
          <Card className="animate-fade-in-up mt-6 space-y-5 p-5">
            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">Interests</p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <Chip
                    key={interest}
                    selected={interests.includes(interest)}
                    onClick={() => setInterests(toggleItem(interests, interest))}
                  >
                    {interest}
                  </Chip>
                ))}
              </div>
            </div>

            {selectedMode === "language" && (
              <div>
                <p className="mb-2 text-sm font-medium text-text-primary">Language</p>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGE_OPTIONS.map((lang) => (
                    <Chip key={lang} selected={language === lang} onClick={() => setLanguage(lang === language ? null : lang)}>
                      {lang}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="mb-2 text-sm font-medium text-text-primary">Conversation intent</p>
              <div className="flex flex-wrap gap-2">
                {INTENT_OPTIONS.map((intent) => (
                  <Chip key={intent} selected={intents.includes(intent)} onClick={() => setIntents(toggleItem(intents, intent))}>
                    {intent}
                  </Chip>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t border-border pt-4">
              <Button iconRight={<ArrowRight />} onClick={startSearch}>
                Start Searching
              </Button>
            </div>
          </Card>
        )}

        <div className="mt-6">
          <PhaseNotice>
            These filters describe what you're looking for and carry through to the connection
            screen — actually finding a matching peer needs the Phase 5 signaling adapter, which
            isn't connected yet.
          </PhaseNotice>
        </div>
      </div>
    </div>
  );
}
