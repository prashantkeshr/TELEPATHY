import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Radio, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PhaseNotice } from "@/components/ui/PhaseNotice";
import { Badge } from "@/components/ui/Badge";
import { pickConversationStarters } from "@/constants/conversationStarters";

const stages = ["Idle", "Searching", "Matched", "Negotiating", "Connecting", "Connected"];

export function RandomMatchPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const interests = useMemo(() => params.get("interests")?.split(",").filter(Boolean) ?? [], [params]);
  const language = params.get("language");
  const intents = useMemo(() => params.get("intents")?.split(",").filter(Boolean) ?? [], [params]);
  const hasFilters = interests.length > 0 || !!language || intents.length > 0;

  const starters = useMemo(() => pickConversationStarters(interests, 3), [interests]);

  return (
    <div>
      <PageHeader
        title="Random Conversation"
        actions={
          <Button variant="ghost" size="sm" iconLeft={<ArrowLeft />} onClick={() => navigate("/discover")}>
            Back
          </Button>
        }
      />
      <div className="mx-auto max-w-xl px-5 py-8 sm:px-8">
        <Card className="p-6 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-accent-muted text-accent">
            <Radio className="size-6" />
          </div>
          <h2 className="text-base font-semibold text-text-primary">
            Matching isn't connected yet
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-text-secondary">
            Telepathy is frontend-first, peer-to-peer communication with optional signaling.
            Finding a stranger to talk to needs a rendezvous service so two peers can discover
            each other before connecting directly over WebRTC — that signaling adapter and the
            connection state machine ship in Phase 5.
          </p>

          {hasFilters && (
            <div className="mt-5 border-t border-border pt-5 text-left">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
                Ready to search for
              </p>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((i) => (
                  <Badge key={i} tone="accent">{i}</Badge>
                ))}
                {language && <Badge tone="info">{language}</Badge>}
                {intents.map((i) => (
                  <Badge key={i}>{i}</Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            {stages.map((stage) => (
              <Badge key={stage} tone="neutral">
                {stage}
              </Badge>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button variant="outline" onClick={() => navigate("/rooms?type=private")}>
              Create Private Room instead
            </Button>
            <Button variant="ghost" onClick={() => navigate("/discover")}>
              Choose another mode
            </Button>
          </div>
        </Card>

        <Card className="mt-4 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-4 text-vivid-amber" />
            <p className="text-sm font-semibold text-text-primary">Conversation starters</p>
          </div>
          <p className="mb-3 text-[13px] text-text-secondary">
            Generated locally from your interests — ready to use the moment you connect.
          </p>
          <ul className="space-y-2">
            {starters.map((s) => (
              <li key={s} className="rounded-[var(--radius-md)] bg-surface-2 px-3.5 py-2.5 text-sm text-text-primary">
                {s}
              </li>
            ))}
          </ul>
        </Card>

        <div className="mt-4">
          <PhaseNotice>
            Once signaling lands, this screen becomes the live connection flow: Searching →
            Matched → Negotiating → Connecting → Connected, with automatic fallback to audio or
            text if video or the peer connection can't be established.
          </PhaseNotice>
        </div>
      </div>
    </div>
  );
}
