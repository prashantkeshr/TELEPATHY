import { useNavigate } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { Users } from "lucide-react";
import { db } from "@/services/storage/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";

export function FriendsPage() {
  const navigate = useNavigate();
  const people = useLiveQuery(() => db.savedPeople.orderBy("savedAt").reverse().toArray(), [], []);

  return (
    <div>
      <PageHeader title="Friends" description="People you've saved from past conversations. Stored on this device only." />
      <div className="px-5 py-6 sm:px-8">
        {people && people.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((p) => (
              <Card key={p.id} className="flex items-center gap-3 p-3">
                <Avatar name={p.nickname} src={p.avatarDataUrl} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text-primary">{p.nickname}</p>
                  {p.note && <p className="truncate text-xs text-text-tertiary">{p.note}</p>}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Users />}
            title="No saved people yet"
            description="Save someone after a conversation to find them here later. Friends stay local to this device unless you explicitly export them."
            action={
              <Button size="sm" variant="outline" onClick={() => navigate("/discover")}>
                Discover Someone
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
