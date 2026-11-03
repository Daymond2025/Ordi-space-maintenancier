import type { ReactNode } from "react";
import { RouteGuard } from "@/components/RouteGuard";

/**
 * Espace "Boutique" (revente de produits par le livreur, commissions) — hors
 * du groupe (shell) principal. Cadre commun minimal : la nav à 4 onglets
 * (Accueil/Catégorie/Ventes/Profil) vit dans (tabs)/layout.tsx, pas ici, pour
 * qu'un détail produit (produits/[id]) ou l'écran Filtres (categorie) puisse
 * s'en affranchir tout en gardant ce même cadre "carte centrée".
 */
export default function BoutiqueLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      {/* h-dvh + overflow-hidden (pas juste min-h-dvh comme le shell principal) :
          sans ce plafond, body (min-h-full, voir app/layout.tsx) grandit avec le
          contenu et fait défiler toute la page au lieu du seul conteneur interne
          (barres fixes des écrans, comme le bouton "Afficher les résultats"). */}
      <div className="mx-auto flex h-dvh w-full max-w-xl flex-col overflow-hidden bg-[#f2f5fa] md:my-6 md:h-auto md:min-h-[calc(100dvh-3rem)] md:max-h-[calc(100dvh-3rem)] md:rounded-[2rem] md:shadow-2xl md:shadow-slate-900/15 md:ring-1 md:ring-black/5">
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      </div>
    </RouteGuard>
  );
}
