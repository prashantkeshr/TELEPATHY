import { NavLink } from "react-router-dom";
import { Users, Lightbulb, Settings, Info, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/services/theme/ThemeProvider";
import { cn } from "@/utils/cn";

export function MoreSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { preference, setPreference } = useTheme();

  if (!open) return null;

  const items = [
    { to: "/friends", label: "Friends", icon: Users },
    { to: "/ideas", label: "Ideas", icon: Lightbulb },
    { to: "/settings", label: "Settings", icon: Settings },
    { to: "/about", label: "About & FAQ", icon: Info },
  ];

  return (
    <div className="fixed inset-0 z-[90] flex items-end lg:hidden">
      <div
        className="absolute inset-0 bg-[var(--color-overlay)]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full rounded-t-[var(--radius-xl)] border-t border-border-strong bg-surface-2 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-2xl">
        <div className="mx-auto mt-2.5 h-1 w-9 rounded-full bg-border-strong" />
        <nav className="px-3 py-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-3 text-[15px] font-medium",
                  isActive ? "text-accent" : "text-text-primary",
                )
              }
            >
              <item.icon className="size-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border px-4 py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-text-tertiary">
            Appearance
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "light" as const, label: "Light", icon: Sun },
              { value: "dark" as const, label: "Dark", icon: Moon },
              { value: "system" as const, label: "System", icon: Monitor },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPreference(opt.value)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-[var(--radius-md)] border py-2.5 text-xs font-medium",
                  preference === opt.value
                    ? "border-accent bg-accent-muted text-accent"
                    : "border-border text-text-secondary",
                )}
              >
                <opt.icon className="size-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
