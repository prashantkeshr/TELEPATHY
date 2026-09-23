import { useNavigate, useSearchParams } from "react-router-dom";
import { DoorOpen, Hash, LogIn } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Card } from "@/components/ui/Card";
import { PhaseNotice } from "@/components/ui/PhaseNotice";

export function RoomsPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const type = params.get("type") === "topic" ? "topic" : "private";

  return (
    <div>
      <PageHeader
        title="Rooms"
        description="Topic rooms for focused discussion, or private rooms you create and invite people to."
        actions={
          <SegmentedControl
            value={type}
            onChange={(v) => setParams({ type: v })}
            options={[
              { value: "topic", label: "Topic" },
              { value: "private", label: "Private" },
            ]}
          />
        }
      />
      <div className="px-5 py-6 sm:px-8">
        {type === "topic" ? (
          <EmptyState
            icon={<Hash />}
            title="Topic rooms aren't open yet"
            description="Group rooms need a server-assisted mode (an SFU) to scale past a couple of peers — that's a future phase. One-to-one private rooms are ready now, under the Private tab."
          />
        ) : (
          <div className="mx-auto max-w-xl space-y-3">
            <Card
              className="hover-lift flex cursor-pointer items-center gap-4 p-5"
              onClick={() => navigate("/rooms/host")}
            >
              <div className="flex size-11 items-center justify-center rounded-full bg-accent-muted text-accent">
                <DoorOpen className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">Create a room</p>
                <p className="text-[13px] text-text-secondary">Generate an invite code for someone to join directly.</p>
              </div>
            </Card>
            <Card
              className="hover-lift flex cursor-pointer items-center gap-4 p-5"
              onClick={() => navigate("/rooms/join")}
            >
              <div className="flex size-11 items-center justify-center rounded-full bg-vivid-cyan/15 text-vivid-cyan">
                <LogIn className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">Join a room</p>
                <p className="text-[13px] text-text-secondary">Have a code from someone else? Enter it here.</p>
              </div>
            </Card>

            <PhaseNotice>
              Private rooms connect peer-to-peer using a one-time code you exchange yourselves (via
              any chat app, email, or in person) — Telepathy has no server to relay it automatically
              yet. QR-code invites and shareable links are a planned follow-up.
            </PhaseNotice>
          </div>
        )}
      </div>
    </div>
  );
}
