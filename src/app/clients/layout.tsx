import type { ReactNode } from "react";
import { RouteGuard } from "@/components/RouteGuard";

/** "Mes clients" et "Profil clients" — plein écran, sans barre du bas (même habillage que rendez-vous/layout.tsx). */
export default function ClientsLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      <div className="mx-auto flex h-dvh w-full max-w-xl flex-col bg-white md:my-6 md:min-h-[calc(100dvh-3rem)] md:max-h-[calc(100dvh-3rem)] md:overflow-hidden md:rounded-[2rem] md:shadow-2xl md:shadow-slate-900/15 md:ring-1 md:ring-black/5">
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </RouteGuard>
  );
}
