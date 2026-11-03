"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, OutilsIcon, StoreIcon, UserIcon } from "@/components/icons";
import type { ComponentType, SVGProps } from "react";

const ONGLETS = [
  { href: "/", label: "Space", icone: HomeIcon },
  { href: "/interventions", label: "Intervention", icone: OutilsIcon },
  { href: "/boutique", label: "Catalogue", icone: StoreIcon },
  { href: "/compte", label: "compte", icone: UserIcon },
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
    <Link href={href} aria-current={actif ? "page" : undefined} className="flex flex-1 flex-col items-center gap-1 py-2 text-[#111111]">
      <Icone className="h-[26px] w-[26px]" />
      <span className={`text-center text-[13px] leading-tight ${actif ? "font-semibold" : "font-normal"}`}>{label}</span>
    </Link>
  );
}

/** Barre du bas de l'app Maintenancier — 4 onglets d'après la maquette de l'accueil. */
export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="sticky bottom-0 z-20 flex items-center bg-white px-1 pb-[max(env(safe-area-inset-bottom),0.25rem)] pt-1"
      style={{ boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.08)" }}
    >
      {ONGLETS.map((onglet) => (
        <Onglet key={onglet.href} {...onglet} actif={onglet.href === "/" ? pathname === "/" : pathname.startsWith(onglet.href)} />
      ))}
    </nav>
  );
}
