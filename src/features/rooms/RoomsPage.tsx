import { useSearchParams } from "react-router-dom";
import { DoorOpen, Hash, Lock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";

export function RoomsPage() {
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
            description="Technology, AI, Programming, Study, and other topic rooms are built in Phase 6 (Rooms), alongside custom topics."
          />
        ) : (
          <EmptyState
            icon={<Lock />}
            title="Private rooms aren't ready yet"
            description="Room codes, invitation links, QR invites, and host controls ship in Phase 6 (Rooms). Once available, a private room needs no account — just a link."
            action={
              <Button size="sm" variant="outline" disabled iconLeft={<DoorOpen />}>
                Create room — coming soon
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
