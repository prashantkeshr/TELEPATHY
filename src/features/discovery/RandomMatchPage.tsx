import { useNavigate } from "react-router-dom";
import { ArrowLeft, Radio } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PhaseNotice } from "@/components/ui/PhaseNotice";
import { Badge } from "@/components/ui/Badge";

const stages = ["Idle", "Searching", "Matched", "Negotiating", "Connecting", "Connected"];

export function RandomMatchPage() {
  const navigate = useNavigate();
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

          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5">
            {stages.map((stage) => (
              <Badge key={stage} tone={stage === "Idle" ? "neutral" : "neutral"}>
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
