import { useEffect, useState } from "react";
import {
  User,
  Palette,
  MessageSquare,
  Shield,
  Video,
  Bell,
  Database,
  Gauge,
  Globe,
  Accessibility,
  SlidersHorizontal,
  Stethoscope,
  Sun,
  Moon,
  Monitor,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { db } from "@/services/storage/db";
import { useTheme, type ThemePreference } from "@/services/theme/ThemeProvider";
import { useToast } from "@/components/ui/Toast";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

interface SettingsGroup {
  icon: LucideIcon;
  title: string;
  ready: boolean;
}

const groups: SettingsGroup[] = [
  { icon: User, title: "Account / Profile", ready: false },
  { icon: MessageSquare, title: "Conversation", ready: false },
  { icon: Shield, title: "Privacy", ready: false },
  { icon: Video, title: "Media", ready: false },
  { icon: Bell, title: "Notifications", ready: false },
  { icon: Gauge, title: "Performance", ready: false },
  { icon: Globe, title: "Language", ready: false },
  { icon: Accessibility, title: "Accessibility", ready: false },
  { icon: SlidersHorizontal, title: "Advanced", ready: false },
  { icon: Stethoscope, title: "Diagnostics", ready: false },
];

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function SettingsPage() {
  const { preference, setPreference } = useTheme();
  const { show } = useToast();
  const [usage, setUsage] = useState<{ usage: number; quota: number } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [counts, setCounts] = useState({ savedPeople: 0, conversations: 0, ideas: 0 });

  useEffect(() => {
    if (navigator.storage?.estimate) {
      navigator.storage.estimate().then((est) => {
        setUsage({ usage: est.usage ?? 0, quota: est.quota ?? 0 });
      });
    }
    Promise.all([db.savedPeople.count(), db.conversations.count(), db.ideas.count()]).then(
      ([savedPeople, conversations, ideas]) => setCounts({ savedPeople, conversations, ideas }),
    );
  }, []);

  const clearLocalData = async () => {
    await Promise.all([
      db.savedPeople.clear(),
      db.conversations.clear(),
      db.ideas.clear(),
      db.blockedUsers.clear(),
    ]);
    setCounts({ savedPeople: 0, conversations: 0, ideas: 0 });
    setConfirmOpen(false);
    show("Local conversation data cleared", "success");
  };

  return (
    <div>
      <PageHeader title="Settings" description="Preferences are stored locally on this device." />
      <div className="mx-auto max-w-2xl space-y-6 px-5 py-6 sm:px-8">
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Palette className="size-4 text-text-tertiary" />
            <h2 className="text-sm font-semibold text-text-primary">Appearance</h2>
          </div>
          <SegmentedControl<ThemePreference>
            value={preference}
            onChange={setPreference}
            options={[
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ]}
          />
          <p className="mt-2 flex items-center gap-1.5 text-xs text-text-tertiary">
            {preference === "light" && <Sun className="size-3.5" />}
            {preference === "dark" && <Moon className="size-3.5" />}
            {preference === "system" && <Monitor className="size-3.5" />}
            {preference === "system" ? "Follows your device setting" : `Always ${preference}`}
          </p>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Database className="size-4 text-text-tertiary" />
            <h2 className="text-sm font-semibold text-text-primary">Storage</h2>
          </div>
          {usage && (
            <p className="mb-3 text-sm text-text-secondary">
              {formatBytes(usage.usage)} used
              {usage.quota > 0 && ` of ${formatBytes(usage.quota)} available`}
            </p>
          )}
          <div className="mb-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-[var(--radius-sm)] bg-surface-2 py-2">
              <p className="text-sm font-semibold text-text-primary">{counts.savedPeople}</p>
              <p className="text-[11px] text-text-tertiary">Saved people</p>
            </div>
            <div className="rounded-[var(--radius-sm)] bg-surface-2 py-2">
              <p className="text-sm font-semibold text-text-primary">{counts.conversations}</p>
              <p className="text-[11px] text-text-tertiary">Conversations</p>
            </div>
            <div className="rounded-[var(--radius-sm)] bg-surface-2 py-2">
              <p className="text-sm font-semibold text-text-primary">{counts.ideas}</p>
              <p className="text-[11px] text-text-tertiary">Ideas</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            iconLeft={<Trash2 />}
            onClick={() => setConfirmOpen(true)}
          >
            Clear local data
          </Button>
        </Card>

        <div>
          <h2 className="mb-2 px-1 text-xs font-medium uppercase tracking-wide text-text-tertiary">
            More settings
          </h2>
          <Card className="divide-y divide-border overflow-hidden">
            {groups.map((group) => (
              <div key={group.title} className="flex items-center gap-3 px-4 py-3">
                <group.icon className="size-4 text-text-tertiary" />
                <span className="flex-1 text-sm text-text-primary">{group.title}</span>
                <span className="text-xs text-text-tertiary">Coming soon</span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Clear local data?"
        description="This permanently removes saved people, conversation history, and ideas from this device. Your profile and settings are kept."
      >
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={clearLocalData}>
            Clear data
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
