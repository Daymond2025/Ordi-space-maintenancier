import type { ReactNode } from "react";
import { RouteGuard } from "@/components/RouteGuard";

/**
 * Écran "Mes infos" (ouvert en tapant la photo de "Mon Profil") — hors du
 * groupe (shell), même habillage "carte centrée" que boutique/layout.tsx :
 * hauteur de l'écran fixée pour que le bouton "Se déconnecter" reste calé en
 * bas de page.
 */
export default function MesInfosLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      <div className="mx-auto flex h-dvh w-full max-w-xl flex-col overflow-hidden bg-[#F7F8FF] md:my-6 md:h-auto md:min-h-[calc(100dvh-3rem)] md:max-h-[calc(100dvh-3rem)] md:rounded-[2rem] md:shadow-2xl md:shadow-slate-900/15 md:ring-1 md:ring-black/5">
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </RouteGuard>
  );
}
