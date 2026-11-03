"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GridIcon, HomeIcon, UserIcon } from "@/components/icons";
import type { ComponentType, SVGProps } from "react";

const ONGLETS = [
  { href: "/boutique", label: "Accueil", icone: HomeIcon },
  { href: "/boutique/categorie", label: "Catégorie", icone: GridIcon },
  { href: "/boutique/ventes", label: "Ventes", icone: GridIcon },
  { href: "/boutique/profil", label: "Profil", icone: UserIcon },
] as const;

function Onglet({
  href,
  label,
  icone: Icone,
  actif,
}: {
  href: string;
  label: string;
  icone: ComponentType<SVGProps<SVGSVGElement>>;
  actif: boolean;
}) {
  return (
    <Link href={href} className="flex flex-1 flex-col items-center gap-1 py-2">
      <Icone className={`h-5 w-5 ${actif ? "text-[color:var(--brand-blue-end)]" : "text-brand-muted"}`} />
      <span className={`text-center text-[10px] font-medium leading-tight ${actif ? "text-[color:var(--brand-blue-end)]" : "text-brand-muted"}`}>
        {label}
      </span>
    </Link>
  );
}

/** Bottom bar de l'espace "Boutique" — 4 onglets d'après le mockup, distincte de la nav principale (BottomNav.tsx). */
export function BottomNavBoutique() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-20 flex items-center border-t border-brand-line bg-white px-1 pb-[max(env(safe-area-inset-bottom),0.25rem)] pt-1">
      {ONGLETS.map((onglet) => (
        <Onglet key={onglet.href} {...onglet} actif={pathname === onglet.href} />
      ))}
    </nav>
  );
}
