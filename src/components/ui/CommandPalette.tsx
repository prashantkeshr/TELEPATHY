import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Compass,
  MessageSquare,
  DoorOpen,
  Users,
  Lightbulb,
  Settings,
  Shuffle,
  Sun,
  Moon,
  Monitor,
  Search,
} from "lucide-react";
import { useTheme } from "@/services/theme/ThemeProvider";
import { cn } from "@/utils/cn";

interface Command {
  id: string;
  label: string;
  group: string;
  icon: typeof Home;
  run: () => void;
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { setPreference } = useTheme();

  const commands = useMemo<Command[]>(
    () => [
      { id: "home", label: "Go to Home", group: "Navigate", icon: Home, run: () => navigate("/") },
      { id: "discover", label: "Discover", group: "Navigate", icon: Compass, run: () => navigate("/discover") },
      { id: "random", label: "Start random conversation", group: "Navigate", icon: Shuffle, run: () => navigate("/discover/random") },
      { id: "chats", label: "Open Chats", group: "Navigate", icon: MessageSquare, run: () => navigate("/chats") },
      { id: "rooms", label: "Open Rooms", group: "Navigate", icon: DoorOpen, run: () => navigate("/rooms") },
      { id: "friends", label: "Open Friends", group: "Navigate", icon: Users, run: () => navigate("/friends") },
      { id: "ideas", label: "Open Ideas", group: "Navigate", icon: Lightbulb, run: () => navigate("/ideas") },
      { id: "settings", label: "Open Settings", group: "Navigate", icon: Settings, run: () => navigate("/settings") },
      { id: "theme-dark", label: "Switch to dark theme", group: "Appearance", icon: Moon, run: () => setPreference("dark") },
      { id: "theme-light", label: "Switch to light theme", group: "Appearance", icon: Sun, run: () => setPreference("light") },
      { id: "theme-system", label: "Match system theme", group: "Appearance", icon: Monitor, run: () => setPreference("system") },
    ],
    [navigate, setPreference],
  );

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const groups = Array.from(new Set(filtered.map((c) => c.group)));

  return (
    <div className="fixed inset-0 z-[95] flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-[var(--color-overlay)]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface-2 shadow-2xl"
      >
        <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
          <Search className="size-4 text-text-tertiary" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands…"
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-tertiary outline-none"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-text-tertiary">Esc</kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-text-tertiary">No matching commands.</p>
          )}
          {groups.map((group) => (
            <div key={group} className="mb-1">
              <p className="px-4 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wide text-text-tertiary">
                {group}
              </p>
              {filtered
                .filter((c) => c.group === group)
                .map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      c.run();
                      onClose();
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-text-primary",
                      "hover:bg-surface-3",
                    )}
                  >
                    <c.icon className="size-4 text-text-tertiary" />
                    {c.label}
                  </button>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
