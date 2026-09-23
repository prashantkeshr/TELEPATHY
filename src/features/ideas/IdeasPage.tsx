import { useLiveQuery } from "dexie-react-hooks";
import { Lightbulb } from "lucide-react";
import { db } from "@/services/storage/db";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export function IdeasPage() {
  const ideas = useLiveQuery(() => db.ideas.orderBy("updatedAt").reverse().toArray(), [], []);

  return (
    <div>
      <PageHeader title="Ideas" description="Projects, questions, and things you want to teach or learn." />
      <div className="px-5 py-6 sm:px-8">
        {ideas && ideas.length > 0 ? (
          <div className="space-y-2">
            {ideas.map((idea) => (
              <Card key={idea.id} className="p-4">
                <div className="mb-1 flex items-center gap-2">
                  <Badge tone="accent">{idea.type}</Badge>
                  <p className="text-sm font-semibold text-text-primary">{idea.title}</p>
                </div>
                <p className="text-[13px] text-text-secondary">{idea.description}</p>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Lightbulb />}
            title="No ideas yet"
            description="The idea workspace — titles, tags, links, notes, and shared whiteboard/code — is built in Phase 7 (Knowledge Exchange)."
          />
        )}
      </div>
    </div>
  );
}
