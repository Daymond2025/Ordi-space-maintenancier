import type { ReactNode } from "react";
import { RouteGuard } from "@/components/RouteGuard";

/**
 * Écran "Modifier mon profil" — hors du groupe (shell), même habillage
 * "carte centrée" que mission/layout.tsx (pas de bottom nav sur un écran de
 * détail plein écran).
 */
export default function ModifierProfilLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col bg-[#f2f5fa] md:my-6 md:min-h-[calc(100dvh-3rem)] md:max-h-[calc(100dvh-3rem)] md:overflow-hidden md:rounded-[2rem] md:shadow-2xl md:shadow-slate-900/15 md:ring-1 md:ring-black/5">
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </RouteGuard>
  );
}
