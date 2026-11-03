"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api";
import type { Pagination } from "@/lib/types";
import type { ProduitBoutique } from "@/lib/produitsBoutique";
import { FAMILLES, compterFiltres, lireFiltres, versParametresApi } from "@/lib/filtresCatalogue";
import { ChevronLeftIcon } from "@/components/icons";
import { GrilleProduitsBoutique } from "@/components/boutique/GrilleProduitsBoutique";

const DEGRADE_HEADER = "linear-gradient(90deg, #0077FF 0%, #00BFFF 100%)";

/**
 * "Afficher les résultats" de l'écran Filtres : les produits à revendre qui
 * correspondent à la sélection (GET /produits avec les mêmes filtres). Le retour
 * ramène à l'écran Filtres, sélection conservée (elle est dans l'URL).
 */
export function EcranResultats() {
  const router = useRouter();
  const recherche = useSearchParams();
  const { token } = useAuth();
  const chaine = recherche.toString();
  const filtres = useMemo(() => lireFiltres(new URLSearchParams(chaine)), [chaine]);
  const [produits, setProduits] = useState<ProduitBoutique[] | null>(null);

  const requete = versParametresApi(filtres).toString();

  useEffect(() => {
    let annule = false;
    apiFetch<Pagination<ProduitBoutique>>(`/produits?${requete}&per_page=50`, { token: token ?? undefined })
      .then((page) => {
        if (!annule) setProduits(page.data);
      })
      .catch(() => {
        if (!annule) setProduits([]);
      });
    return () => {
      annule = true;
    };
  }, [requete, token]);

  const nombreFiltres = compterFiltres(filtres);
  const familleLabel = FAMILLES.find((f) => f.id === filtres.famille)?.label ?? "";

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-[#f2f5fa]">
      <div className="shrink-0 px-4 pb-5 pt-5" style={{ background: DEGRADE_HEADER, borderRadius: "0 0 30px 30px" }}>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Retour aux filtres"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="text-center text-white">
            <p className="text-base font-extrabold">Résultats</p>
            <p className="text-[11px] font-semibold text-white/80">
              {familleLabel}
              {nombreFiltres > 0 ? ` • ${nombreFiltres} filtre${nombreFiltres > 1 ? "s" : ""}` : ""}
              {produits ? ` • ${produits.length} produit${produits.length > 1 ? "s" : ""}` : ""}
            </p>
          </div>
          <span className="h-9 w-9" aria-hidden="true" />
        </div>
      </div>

      {produits === null ? (
        <p className="py-10 text-center text-sm text-brand-muted">Chargement…</p>
      ) : produits.length === 0 ? (
        <div className="flex flex-col items-center gap-4 px-8 py-12 text-center">
          <p className="text-sm text-brand-muted">Aucun produit à revendre ne correspond à ces filtres.</p>
          <button type="button" onClick={() => router.back()} className="h-11 rounded-xl px-6 text-sm font-extrabold text-white" style={{ background: "#FF6B0B" }}>
            Modifier les filtres
          </button>
        </div>
      ) : (
        <GrilleProduitsBoutique produits={produits} />
      )}
    </div>
  );
}
