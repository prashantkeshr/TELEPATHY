import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { IconButton } from "@/components/ui/IconButton";
import { bottomNavItems } from "@/layouts/nav-items";
import { MoreSheet } from "@/layouts/MoreSheet";
import { cn } from "@/utils/cn";

export function MobileTopBar({ onOpenCommandPalette }: { onOpenCommandPalette: () => void }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-bg-elevated px-4 lg:hidden">
      <Logo size={26} />
      <div className="flex items-center gap-1">
        <IconButton label="Search" variant="ghost" onClick={onOpenCommandPalette}>
          <Search />
        </IconButton>
      </div>
    </header>
  );
}

export function BottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch border-t border-border bg-bg-elevated pb-[env(safe-area-inset-bottom)] lg:hidden">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium",
                isActive ? "text-accent" : "text-text-tertiary",
              )
            }
          >
            <item.icon className="size-5" />
            {item.label}
          </NavLink>
        ))}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium text-text-tertiary"
        >
          <Menu className="size-5" />
          More
        </button>
      </nav>
      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
