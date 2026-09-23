import { NavLink } from "react-router-dom";
import { Search, Shuffle } from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Avatar";
import { primaryNavItems, settingsNavItem } from "@/layouts/nav-items";
import { cn } from "@/utils/cn";

export function Sidebar({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-bg-elevated">
      <div className="px-4 py-5">
        <LogoMark />
      </div>

      <div className="px-3 pb-3">
        <button
          onClick={onOpenCommandPalette}
          className="flex w-full items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2 text-sm text-text-tertiary hover:border-border-strong hover:text-text-secondary transition-colors"
        >
          <Search className="size-4" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        </button>
      </div>

      <div className="px-3 pb-3">
        <NavLink
          to="/discover/random"
          className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-accent px-3 py-2.5 text-sm font-medium text-text-on-accent hover:bg-accent-hover transition-colors"
        >
          <Shuffle className="size-4" />
          Random Conversation
        </NavLink>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {primaryNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent-muted text-accent"
                  : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3 space-y-0.5">
        <NavLink
          to={settingsNavItem.to}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent-muted text-accent"
                : "text-text-secondary hover:bg-surface-2 hover:text-text-primary",
            )
          }
        >
          <settingsNavItem.icon className="size-4" />
          Settings
        </NavLink>
        <div className="flex items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2">
          <Avatar name="You" size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text-primary">Your profile</p>
            <p className="truncate text-xs text-text-tertiary">Local only</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
