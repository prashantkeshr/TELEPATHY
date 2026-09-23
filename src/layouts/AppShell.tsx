import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/storage/db";
import { Sidebar } from "@/layouts/Sidebar";
import { MobileTopBar, BottomNav } from "@/layouts/MobileChrome";
import { CommandPalette } from "@/components/ui/CommandPalette";

const PUBLIC_PATHS = ["/", "/about", "/discover", "/rooms"];

export function AppShell() {
  const { pathname } = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const profileCheck = useLiveQuery(
    async () => ({ resolved: true, exists: (await db.profile.get("local")) !== undefined }),
    [],
    { resolved: false, exists: false },
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  if (!profileCheck.resolved) return null;
  // Informational pages stay reachable without a profile — search crawlers
  // (which never have one) would otherwise be redirected off every public
  // URL and index /onboarding instead. Everything that acts on personal
  // data still requires a profile; Home invites profile-less visitors to
  // create one instead of forcing a redirect.
  if (!profileCheck.exists && !PUBLIC_PATHS.includes(pathname)) return <Navigate to="/onboarding" replace />;

  return (
    <div className="flex h-dvh min-h-dvh overflow-hidden bg-bg text-text-primary">
      <Sidebar onOpenCommandPalette={() => setPaletteOpen(true)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar onOpenCommandPalette={() => setPaletteOpen(true)} />
        <main className="flex-1 overflow-y-auto pb-[calc(64px+env(safe-area-inset-bottom))] lg:pb-0">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
