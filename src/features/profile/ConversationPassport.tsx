import { Languages, Sparkles, MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { ProfileVisibility } from "@/services/storage/db";

export interface PassportData {
  displayName: string;
  avatarDataUrl?: string;
  languagesSpoken: string[];
  languagesLearning: string[];
  interests: string[];
  intents: string[];
  conversationStyle: string[];
  about?: string;
  visibility: ProfileVisibility;
}

/**
 * The compact, conversation-compatibility identity card shown in onboarding
 * preview and (once matching exists) to a matched peer. Deliberately not a
 * dating-profile layout — no photos grid, no age/location, just what helps
 * two people find something to talk about.
 */
export function ConversationPassport({ data }: { data: PassportData }) {
  const showAvatar = data.visibility.avatar;
  const showLanguages = data.visibility.languages && (data.languagesSpoken.length > 0 || data.languagesLearning.length > 0);
  const showInterests = data.visibility.interests && data.interests.length > 0;
  const showAbout = data.visibility.about && !!data.about;

  return (
    <Card className="overflow-hidden">
      <div className="aurora-backdrop opacity-60" />
      <div className="relative flex items-center gap-3 border-b border-border p-4">
        {showAvatar ? (
          <Avatar name={data.displayName || "?"} src={data.avatarDataUrl} size="lg" />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-full border border-dashed border-border-strong text-text-tertiary">
            <span className="text-[10px]">Hidden</span>
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-text-primary">
            {data.displayName || "Your name"}
          </p>
          {showInterests && (
            <p className="mt-0.5 truncate text-[13px] text-text-secondary">
              {data.interests.slice(0, 3).join(" · ")}
            </p>
          )}
        </div>
      </div>

      <div className="relative space-y-3 p-4">
        {showLanguages && (
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
              <Languages className="size-3.5" /> Speaks
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.languagesSpoken.map((l) => (
                <Badge key={l}>{l}</Badge>
              ))}
              {data.languagesLearning.map((l) => (
                <Badge key={l} tone="info">Learning {l}</Badge>
              ))}
            </div>
          </div>
        )}

        {data.intents.length > 0 && (
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
              <Sparkles className="size-3.5" /> Here for
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.intents.map((i) => (
                <Badge key={i} tone="accent">{i}</Badge>
              ))}
            </div>
          </div>
        )}

        {data.conversationStyle.length > 0 && (
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
              <MessageCircle className="size-3.5" /> Conversation style
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.conversationStyle.map((s) => (
                <Badge key={s} tone="neutral">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        {showAbout && <p className="text-[13px] text-text-secondary">{data.about}</p>}
      </div>
    </Card>
  );
}
